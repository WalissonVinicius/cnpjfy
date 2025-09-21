using System.IO.Compression;
using CNPJExporter.Configuration;
using CNPJExporter.Exporters;
using CNPJExporter.Processors;
using Microsoft.Data.Sqlite;
using Spectre.Console;

namespace CNPJExporter.Utils;

public static class HashCacheManager
{
    private static SqliteConnection? _connection;
    private static readonly string _dbPath = Path.Combine(AppConfig.Current.Paths.HashCacheDir, "hashes.db");
    private static SqliteTransaction? _currentTransaction;
    private static int _pendingInserts = 0;
    private static bool _initialized = false;
    private const int BatchSize = 10000;
    private static readonly SemaphoreSlim DbSemaphore = new(1, 1);

    static HashCacheManager()
    {
    }

    private static async ValueTask<bool> EnsureDatabaseExists()
    {
        if (File.Exists(_dbPath))
        {
            AnsiConsole.MarkupLine($"[green]✓ Banco de hashes local encontrado[/]");
            return true;
        }

        AnsiConsole.MarkupLine("[yellow]Banco de hashes não encontrado localmente, baixando do Storage...[/]");

        var tempDir = Path.Combine(Path.GetTempPath(), $"hash_download_{Guid.NewGuid():N}");
        Directory.CreateDirectory(tempDir);

        try
        {
            var zipFileName = "hashes.zip";
            var tempZipPath = Path.Combine(tempDir, zipFileName);

            var success = await RcloneClient.DownloadFileAsync(zipFileName, tempZipPath);

            if (success && File.Exists(tempZipPath))
            {
                await DbSemaphore.WaitAsync();
                try
                {
                    ZipFile.ExtractToDirectory(
                        tempZipPath,
                        Path.GetDirectoryName(_dbPath)!,
                        overwriteFiles: true
                    );

                    if (File.Exists(_dbPath))
                    {
                        AnsiConsole.MarkupLine("[green]✓ Banco de hashes baixado e descompactado com sucesso[/]");
                        return true;
                    }
                }
                finally
                {
                    DbSemaphore.Release();
                }
            }
        }
        finally
        {
            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
            }
        }

        AnsiConsole.MarkupLine("[yellow]⚠️ Banco de hashes não encontrado no Storage, criando novo...[/]");
        return false;
    }

    public static async ValueTask InitializeDatabase()
    {
        if (_initialized) return;

        Directory.CreateDirectory(Path.GetDirectoryName(_dbPath)!);

        await EnsureDatabaseExists();

        var connectionString = $"Data Source={_dbPath};Mode=ReadWriteCreate;Cache=Shared;";

        _connection = new(connectionString);
        _connection.Open();

        await using var cmd = _connection.CreateCommand();
        cmd.CommandText = @"
            CREATE TABLE IF NOT EXISTS hashes (
                cnpj TEXT PRIMARY KEY NOT NULL,
                hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
        ";
        cmd.ExecuteNonQuery();

        OptimizeDatabase();
        _initialized = true;
    }

    private static void OptimizeDatabase()
    {
        using var cmd = _connection.CreateCommand();
        cmd.CommandText = @"
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA cache_size = -84000;
            PRAGMA temp_store = MEMORY;
            PRAGMA mmap_size = 30000000000;
        ";
        cmd.ExecuteNonQuery();
    }

    public static async IAsyncEnumerable<ProcessedItem> GetItemsToProcessAsync(IEnumerable<ProcessedItem> items)
    {
        if (!_initialized || _connection == null)
        {
            await InitializeDatabase();
        }

        var newCount = 0;
        var updateCount = 0;

        const int checkBatchSize = 500; // Reduzido para garantir segurança com SQLite

        // Serializa acesso ao banco SQLite para evitar conflitos de transação
        await DbSemaphore.WaitAsync();
        try
        {
            foreach (var batch in items.Chunk(checkBatchSize))
            {
                var placeholders = string.Join(",", batch.Select((_, idx) => $"@p{idx}"));

                await using var cmd = _connection.CreateCommand();
                cmd.CommandText = $"SELECT cnpj, hash FROM hashes WHERE cnpj IN ({placeholders})";

                for (var j = 0; j < batch.Length; j++)
                    cmd.Parameters.AddWithValue($"@p{j}", batch[j].Cnpj);

                var existingHashes = new Dictionary<string, string>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    existingHashes[reader.GetString(0)] = reader.GetString(1);
                }

                foreach (var item in batch)
                {
                    if (!existingHashes.TryGetValue(item.Cnpj, out var existingHash))
                    {
                        newCount++;
                        yield return item;
                    }
                    else if (existingHash != item.Hash)
                    {
                        updateCount++;
                        yield return item;
                    }
                }
            }

            if (newCount > 0 || updateCount > 0)
            {
                AnsiConsole.MarkupLine(
                    $"[cyan]📊 {newCount} novos CNPJs para inserir, {updateCount} CNPJs para atualizar[/]");
            }
        }
        finally
        {
            DbSemaphore.Release();
        }
    }

    public static async ValueTask AddAsync(string cnpj, string hash)
    {
        await InitializeDatabase();

        if (_currentTransaction == null)
        {
            _currentTransaction = _connection.BeginTransaction();
        }

        await using var cmd = _connection.CreateCommand();
        cmd.Transaction = _currentTransaction;
        cmd.CommandText = @"
            INSERT OR REPLACE INTO hashes (cnpj, hash) 
            VALUES (@cnpj, @hash)
        ";
        cmd.Parameters.AddWithValue("@cnpj", cnpj);
        cmd.Parameters.AddWithValue("@hash", hash);

        await cmd.ExecuteNonQueryAsync();

        _pendingInserts++;

        if (_pendingInserts >= BatchSize)
        {
            await CommitBatchAsync();
        }
    }

    public static async ValueTask AddBatchAsync(IEnumerable<ProcessedItem> items)
    {
        await DbSemaphore.WaitAsync();
        try
        {
            foreach (var item in items)
            {
                await AddAsync(item.Cnpj, item.Hash);
            }

            await CommitBatchAsync();
        }
        finally
        {
            DbSemaphore.Release();
        }
    }

    public static async ValueTask<bool> UploadDatabaseAsync()
    {
        await DbSemaphore.WaitAsync();
        await CommitBatchAsync();

        try
        {
            AnsiConsole.MarkupLine("[cyan]📤 Fazendo upload do banco de hashes...[/]");

            var tempDir = Path.Combine(Path.GetTempPath(), $"hash_upload_{Guid.NewGuid():N}");
            Directory.CreateDirectory(tempDir);

            try
            {
                var zipFileName = "hashes.zip";
                var zipPath = Path.Combine(tempDir, zipFileName);
                var tempDbCopyPath = Path.Combine(tempDir, Path.GetFileName(_dbPath));

                CloseConnections();

                AnsiConsole.MarkupLine("[cyan]🗃️ Compactando banco de dados...[/]");

                if (File.Exists(zipPath))
                    File.Delete(zipPath);

                File.Copy(_dbPath, tempDbCopyPath, true);

                using (var archive = ZipFile.Open(zipPath, ZipArchiveMode.Create))
                {
                    archive.CreateEntryFromFile(tempDbCopyPath, Path.GetFileName(_dbPath), CompressionLevel.Optimal);
                }

                AnsiConsole.MarkupLine(
                    $"[cyan]📦 Banco compactado: {new FileInfo(zipPath).Length / 1024 / 1024:N1} MB[/]");

                var success = await RcloneClient.UploadFolderAsync(tempDir);

                if (success)
                    AnsiConsole.MarkupLine("[green]✓ Banco de hashes enviado para Storage[/]");
                else
                    AnsiConsole.MarkupLine("[yellow]⚠️ Falha ao enviar banco de hashes[/]");

                return success;
            }
            finally
            {
                if (Directory.Exists(tempDir))
                {
                    try
                    {
                        Directory.Delete(tempDir, true);
                        AnsiConsole.MarkupLine("[cyan]🧹 Diretório temporário removido[/]");
                    }
                    catch (Exception ex)
                    {
                        AnsiConsole.MarkupLine(
                            $"[yellow]⚠️ Erro ao remover diretório temporário: {ex.Message.EscapeMarkup()}[/]");
                    }
                }
            }
        }
        finally
        {
            DbSemaphore.Release();
        }
    }


    public static async ValueTask CommitBatchAsync()
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.CommitAsync();
            _currentTransaction.Dispose();
            _currentTransaction = null;
            _pendingInserts = 0;
        }
    }

    public static void CloseConnections()
    {
        _currentTransaction?.Dispose();
        _connection?.Close();
        _connection?.Dispose();

        _connection = null;
        _initialized = false;
    }
}