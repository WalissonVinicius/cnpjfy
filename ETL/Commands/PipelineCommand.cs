using System.ComponentModel;
using CNPJExporter.Configuration;
using CNPJExporter.Downloaders;
using CNPJExporter.Processors;
using Spectre.Console;
using Spectre.Console.Cli;

namespace CNPJExporter.Commands;

public class PipelineSettings : CommandSettings
{
    [CommandOption("--month|-m")]
    [Description("Mês (YYYY-MM). Padrão: mês anterior")]
    public string? Month { get; init; }
}

public sealed class PipelineCommand : AsyncCommand<PipelineSettings>
{
    public override async Task<int> ExecuteAsync(CommandContext context, PipelineSettings settings)
    {
        var month = settings.Month ?? DateTime.Now.ToString("yyyy-MM");

        AnsiConsole.MarkupLine($"[cyan]1/6 Baixando dados de {month}...[/]");
        var downloader = new WebDownloader(AppConfig.Current.Paths.DownloadDir, AppConfig.Current.Paths.DataDir);
        await downloader.DownloadAndExtractAsync(month);

        using var ingestor = new ParquetIngestor();

        AnsiConsole.MarkupLine("[cyan]2/6 Convertendo CSVs para Parquet...[/]");
        await ingestor.ConvertCsvsToParquet();

        AnsiConsole.MarkupLine("[cyan]3/6 Export + Upload integrado para Storage...[/]");
        await ingestor.ExportAndUploadToStorage(AppConfig.Current.Paths.OutputDir);

        AnsiConsole.MarkupLine("[cyan]4/6 Testando integridade por amostragem...[/]");
        var tester = new IntegrityTester();
        await tester.RunAsync();

        AnsiConsole.MarkupLine("[cyan]5/6 Gerando ZIP consolidado...[/]");
        var zipPath = await ingestor.ExportJsonsToZip("cnpj_json_export");

        AnsiConsole.MarkupLine("[cyan]6/6 Gerando e enviando estatística final...[/]");
        await ingestor.GenerateAndUploadFinalInfoJsonAsync(zipPath);

        AnsiConsole.MarkupLine("[green]✅ Pipeline completo concluído![/]");
        return 0;
    }
}
