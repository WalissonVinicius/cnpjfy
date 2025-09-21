using CNPJExporter.Processors;
using Spectre.Console;
using Spectre.Console.Cli;

namespace CNPJExporter.Commands;

public class ZipSettings : CommandSettings
{
}

public sealed class ZipCommand : AsyncCommand<ZipSettings>
{
    public override async Task<int> ExecuteAsync(CommandContext context, ZipSettings settings)
    {
        using var ingestor = new ParquetIngestor();
        AnsiConsole.MarkupLine("[yellow]📦 Exportando para ZIP[/]");
        await ingestor.ExportJsonsToZip("cnpj_json_export");
        AnsiConsole.MarkupLine("[green]✅ ZIP criado[/]");
        return 0;
    }
}
