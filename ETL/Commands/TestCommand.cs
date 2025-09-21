using CNPJExporter.Processors;
using Spectre.Console;
using Spectre.Console.Cli;

namespace CNPJExporter.Commands;

public sealed class TestCommand : AsyncCommand
{
    public override async Task<int> ExecuteAsync(CommandContext context)
    {
        var tester = new IntegrityTester();
        AnsiConsole.MarkupLine("[yellow]🧪 Rodando teste de integridade[/]");
        await tester.RunAsync();
        AnsiConsole.MarkupLine("[green]✅ Teste de integridade finalizado[/]");
        return 0;
    }
}
