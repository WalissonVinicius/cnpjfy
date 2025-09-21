using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;
using CNPJExporter.Exporters;
using CNPJExporter.Utils;
using Spectre.Console;
using Standart.Hash.xxHash;

namespace CNPJExporter.Processors;

public class ProcessedItem
{
    public required string Cnpj { get; init; }
    public required string Json { get; init; }
    public required string Hash { get; init; }
}

public class NdjsonProcessor
{
    private static string ComputeHash(string json)
    {
        var hash = xxHash3.ComputeHash(json);
        return hash.ToString("x16");
    }

    private ConcurrentBag<ProcessedItem> ReadAndProcessNdjson(string ndjsonFilePath, ProgressTask task)
    {
        const int bufferSize = 1 << 20; // 1MB
        var processedData = new ConcurrentBag<ProcessedItem>();

        // FileOptions.SequentialScan ajuda o SO a otimizar cache de disco
        using var fs = new FileStream(
            ndjsonFilePath, FileMode.Open, FileAccess.Read, FileShare.Read,
            bufferSize, // 1MB
            options: FileOptions.SequentialScan);

        using var sr = new StreamReader(fs, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, bufferSize);

        if (fs.Length == 0)
        {
            return processedData;
        }

        var lines = ReadLines(sr);

        Parallel.ForEach(lines, line =>
        {
            if (string.IsNullOrWhiteSpace(line)) return;

            var (cnpj, cleanJson) = ExtractCnpjAndJson(line);
            if (string.IsNullOrEmpty(cnpj)) return;

            var hash = ComputeHash(cleanJson);
            processedData.Add(new() { Cnpj = cnpj, Json = cleanJson, Hash = hash });
        });

        return processedData;

        static IEnumerable<string> ReadLines(StreamReader sr)
        {
            string? line;
            while ((line = sr.ReadLine()) != null)
                yield return line;
        }
    }

    public async Task ProcessNdjsonFileToStorage(string ndjsonFilePath, ProgressTask task)
    {
        var processedData = ReadAndProcessNdjson(ndjsonFilePath, task);

        if (processedData.IsEmpty)
        {
            AnsiConsole.MarkupLine($"[yellow]Arquivo {Path.GetFileName(ndjsonFilePath)} está vazio[/]");
            return;
        }

        var tempDir = Path.Combine(Path.GetDirectoryName(ndjsonFilePath) ?? ".",
            Path.GetFileNameWithoutExtension(ndjsonFilePath));

        Directory.CreateDirectory(tempDir);

        try
        {
            var allProcessedItems = await HashCacheManager.GetItemsToProcessAsync(processedData).ToListAsync();

            if (allProcessedItems.Count == 0)
            {
                task.MaxValue = 1;
                task.Increment(1);

                AnsiConsole.MarkupLine($"[green]Nenhuma alteração em {Path.GetFileName(ndjsonFilePath)}[/]");
                return;
            }

            task.MaxValue = allProcessedItems.Count;
            task.Value = 0;

            var processedCount = 0;
            foreach (var item in allProcessedItems)
            {
                processedCount++;
                task.Description = $"[cyan]Escrevendo {processedCount}/{allProcessedItems.Count}: {item.Cnpj}.json[/]";
                await File.WriteAllTextAsync(Path.Combine(tempDir, $"{item.Cnpj}.json"), item.Json);
                task.Increment(1);
            }

            task.Description = $"[yellow]📤 Preparando upload de {allProcessedItems.Count} arquivos...[/]";
            task.MaxValue = 100;
            task.Value = 0;

            var success = await RcloneClient.UploadFolderAsync(tempDir, progressTask: task);

            if (success)
                await HashCacheManager.AddBatchAsync(allProcessedItems);
            else
                throw new("Falha no upload dos arquivos");

            AnsiConsole.MarkupLine($"[green]✓ {allProcessedItems.Count} arquivos enviados com sucesso[/]");
        }
        finally
        {
            if (Directory.Exists(tempDir))
                Directory.Delete(tempDir, true);
        }
    }

    private (string? cnpj, string json) ExtractCnpjAndJson(string jsonLine)
    {
        try
        {
            using var jsonDoc = JsonDocument.Parse(jsonLine);

            var dataElement = jsonDoc.RootElement.TryGetProperty("json_output", out var jsonOutput)
                ? jsonOutput
                : jsonDoc.RootElement;

            if (!dataElement.TryGetProperty("cnpj", out var cnpjProperty))
                return (null, jsonLine);

            var cnpj = cnpjProperty.GetString();
            var rawJson = jsonOutput.ValueKind != JsonValueKind.Undefined
                ? jsonOutput.GetRawText()
                : jsonLine;

            var cleanJson = JsonCleanupUtils.CleanJsonSpaces(rawJson);
            return (cnpj, cleanJson);
        }
        catch
        {
            return (null, jsonLine);
        }
    }
}