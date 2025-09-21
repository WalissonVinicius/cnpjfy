using CNPJExporter.Processors;
using Spectre.Console;
using Spectre.Console.Cli;

namespace CNPJExporter.Commands;

public sealed class IngestCommand : AsyncCommand
{
    public override async Task<int> ExecuteAsync(CommandContext context)
    {
        using var ingestor = new ParquetIngestor();
        AnsiConsole.MarkupLine("[yellow]📥 Convertendo CSVs para Parquet[/]");
        await ingestor.ConvertCsvsToParquet();
        AnsiConsole.MarkupLine("[green]✅ Conversão concluída[/]");
        return 0;
    }
}
