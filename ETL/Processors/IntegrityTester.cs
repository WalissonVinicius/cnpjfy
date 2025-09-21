using CNPJExporter.Configuration;
using CNPJExporter.Exporters;
using CNPJExporter.Utils;
using DuckDB.NET.Data;
using Spectre.Console;
using Standart.Hash.xxHash;

namespace CNPJExporter.Processors;

public class IntegrityTester
{
    public async Task RunAsync(int total = 10)
    {
        // 1) Preparar conexão DuckDB e registrar views para parquet
        await using var conn = new DuckDBConnection($"Data Source={(AppConfig.Current.DuckDb.UseInMemory ? ":memory:" : "./cnpj.duckdb")}");
        conn.Open();
        await LoadParquetViewsAsync(conn);

        // 2) Selecionar CNPJs aleatórios garantindo 1 de 'simples' e 1 de 'socio' (outros)
        var sample = await PickSampleAsync(conn, total);

        if (sample.Count == 0)
        {
            AnsiConsole.MarkupLine("[red]❌ Não foi possível selecionar CNPJs para o teste[/]");
            return;
        }

        // 3) Preparar diretórios temporários
        var tempRoot = Path.Combine(Path.GetTempPath(), $"opencnpj_test_{Guid.NewGuid():N}");
        var localJsonDir = Path.Combine(tempRoot, "local");
        var remoteJsonDir = Path.Combine(tempRoot, "remote");
        Directory.CreateDirectory(localJsonDir);
        Directory.CreateDirectory(remoteJsonDir);

        var ingestor = new ParquetIngestor();

        var results = new List<(string cnpj, string localHash, string remoteHash, bool ok, string? note)>();

        try
        {
            await AnsiConsole.Progress()
                .StartAsync(async ctx =>
                {
                    var task = ctx.AddTask("[green]Comparando hashes[/]", maxValue: sample.Count);

                    foreach (var cnpj in sample)
                    {
                        task.Description = $"[cyan]Processando {cnpj}[/]";

                        string? note = null;
                        var localPath = Path.Combine(localJsonDir, $"{cnpj}.json");
                        var remotePath = Path.Combine(remoteJsonDir, $"{cnpj}.json");

                        try
                        {
                            // 3a) Gerar JSON local idêntico ao pipeline oficial
                            await ingestor.ExportSingleCnpjAsync(cnpj, localJsonDir);

                            if (!File.Exists(localPath))
                                throw new("JSON local não gerado");

                            var localJson = await File.ReadAllTextAsync(localPath);
                            // Garantir normalização igual ao pipeline
                            localJson = JsonCleanupUtils.CleanJsonSpaces(localJson);
                            var localHash = ComputeHash(localJson);

                            // 3b) Baixar JSON do Storage via rclone
                            var ok = await RcloneClient.DownloadFileAsync($"{cnpj}.json", remotePath);
                            if (!ok || !File.Exists(remotePath))
                                throw new("Download via rclone falhou ou arquivo não existe no Storage");

                            var remoteJson = await File.ReadAllTextAsync(remotePath);
                            remoteJson = JsonCleanupUtils.CleanJsonSpaces(remoteJson);
                            var remoteHash = ComputeHash(remoteJson);

                            var equal = string.Equals(localHash, remoteHash, StringComparison.OrdinalIgnoreCase);
                            results.Add((cnpj, localHash, remoteHash, equal, note));
                        }
                        catch (Exception ex)
                        {
                            note = ex.Message;
                            results.Add((cnpj, "-", "-", false, note));
                        }

                        task.Increment(1);
                    }
                });
        }
        finally
        {
            ingestor.Dispose();
        }

        // 4) Report
        var successCount = results.Count(r => r.ok);
        foreach (var r in results)
        {
            if (r.ok)
                AnsiConsole.MarkupLine($"[green]✓ {r.cnpj}[/] [grey](hash {r.localHash})[/]");
            else
                AnsiConsole.MarkupLine($"[red]✗ {r.cnpj}[/] {(r.note ?? "Hashes divergentes ou indisponíveis").EscapeMarkup()}");
        }

        if (successCount == results.Count)
            AnsiConsole.MarkupLine($"[green]✅ {successCount}/{results.Count} CNPJs válidos: hashes idênticos[/]");
        else
            AnsiConsole.MarkupLine($"[red]❌ {successCount}/{results.Count} CNPJs válidos; verifique divergências acima[/]");

        // 5) Cleanup
        Directory.Delete(tempRoot, true);
    }

    private static string ComputeHash(string json)
    {
        var h = xxHash3.ComputeHash(json);
        return h.ToString("x16");
    }

    private static async Task LoadParquetViewsAsync(DuckDBConnection conn)
    {
        var baseDir = AppConfig.Current.Paths.ParquetDir;
        var views = new Dictionary<string, string>
        {
            ["empresa"] = "empresa/**/*.parquet",
            ["estabelecimento"] = "estabelecimento/**/*.parquet",
            ["socio"] = "socio/**/*.parquet",
            ["simples"] = "simples/**/*.parquet",
            ["cnae"] = "cnae.parquet",
            ["motivo"] = "motivo.parquet",
            ["municipio"] = "municipio.parquet",
            ["natureza"] = "natureza.parquet",
            ["pais"] = "pais.parquet",
            ["qualificacao"] = "qualificacao.parquet"
        };

        foreach (var (name, pattern) in views)
        {
            var full = Path.Combine(baseDir, pattern);
            await using var cmd = conn.CreateCommand();
            cmd.CommandText = $"CREATE OR REPLACE VIEW {name} AS SELECT * FROM read_parquet('{full}')";
            await cmd.ExecuteNonQueryAsync();
        }
    }

    private static async Task<List<string>> PickSampleAsync(DuckDBConnection conn, int total)
    {
        var set = new HashSet<string>();

        // Ao menos 1 com SIMPLES
        var simples = await QueryOneAsync(conn, @"
            SELECT e.cnpj_basico || e.cnpj_ordem || e.cnpj_dv AS cnpj
            FROM estabelecimento e
            INNER JOIN simples s ON e.cnpj_basico = s.cnpj_basico
            ORDER BY random() LIMIT 1");
        if (!string.IsNullOrEmpty(simples)) set.Add(simples);

        // Ao menos 1 com SOCIO (outros)
        var socio = await QueryOneAsync(conn, @"
            SELECT e.cnpj_basico || e.cnpj_ordem || e.cnpj_dv AS cnpj
            FROM estabelecimento e
            INNER JOIN socio so ON e.cnpj_basico = so.cnpj_basico
            ORDER BY random() LIMIT 1");
        if (!string.IsNullOrEmpty(socio)) set.Add(socio);

        // Completar com aleatórios de estabelecimento
        while (set.Count < total)
        {
            var remaining = total - set.Count;
            var rand = await QueryManyAsync(conn, $@"
                SELECT DISTINCT e.cnpj_basico || e.cnpj_ordem || e.cnpj_dv AS cnpj
                FROM estabelecimento e
                ORDER BY random() LIMIT {Math.Max(remaining * 2, 8)}");
            foreach (var c in rand)
            {
                set.Add(c);
                if (set.Count >= total) break;
            }
            if (rand.Count == 0) break;
        }

        return set.Take(total).ToList();
    }

    private static async Task<string?> QueryOneAsync(DuckDBConnection conn, string sql)
    {
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        var result = await cmd.ExecuteScalarAsync();
        var val = result?.ToString();
        return string.IsNullOrWhiteSpace(val) ? null : val;
    }

    private static async Task<List<string>> QueryManyAsync(DuckDBConnection conn, string sql)
    {
        var list = new List<string>();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var v = reader.GetString(0);
            if (!string.IsNullOrWhiteSpace(v)) list.Add(v);
        }
        return list;
    }
}
