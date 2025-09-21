using System.Collections.Concurrent;
using System.IO.Compression;
using System.Text.RegularExpressions;
using CNPJExporter.Configuration;
using Spectre.Console;

namespace CNPJExporter.Downloaders;

public class WebDownloader
{
    private const string BaseUrl = "https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/";
    private readonly string _downloadDir;
    private readonly string _extractDir;
    private readonly HttpClient _http;

    public WebDownloader(string downloadDir, string extractDir)
    {
        _downloadDir = downloadDir;
        _extractDir = extractDir;
        Directory.CreateDirectory(_downloadDir);
        Directory.CreateDirectory(_extractDir);

        _http = new()
        {
            Timeout = Timeout.InfiniteTimeSpan
        };
        _http.DefaultRequestHeaders.UserAgent.Add(new("OpenCNPJ", "1.0"));
    }

    public async Task DownloadAndExtractAsync(string yearMonth, CancellationToken ct = default)
    {
        var pageUrl = new Uri(new(BaseUrl), yearMonth.Trim('/') + "/").ToString();
        AnsiConsole.MarkupLine($"[blue]Acessando:[/] [white]{pageUrl}[/]");

        var zipUrls = await ListZipUrlsAsync(pageUrl, ct);
        if (zipUrls.Count == 0)
        {
            AnsiConsole.MarkupLine("[yellow]Nenhum arquivo ZIP encontrado nessa página.[/]");
            return;
        }

        var localZips = await DownloadAllAsync(zipUrls, ct);
        await ExtractAllAsync(localZips, _extractDir, ct);
    }

    private async Task<List<string>> ListZipUrlsAsync(string pageUrl, CancellationToken ct)
    {
        try
        {
            var html = await _http.GetStringAsync(pageUrl, ct);
            var urls = new List<string>();

            var rx = new Regex("href=\\\"([^\\\"]+?\\.zip)\\\"", RegexOptions.IgnoreCase);
            foreach (Match m in rx.Matches(html))
            {
                var href = m.Groups[1].Value;
                if (string.IsNullOrWhiteSpace(href)) continue;
                var outUri = href.StartsWith("http", StringComparison.OrdinalIgnoreCase)
                    ? new(href)
                    : new Uri(new(pageUrl), href);
                urls.Add(outUri.ToString());
            }

            AnsiConsole.MarkupLine($"[green]Encontrados {urls.Count} ZIP(s).[/]");
            return urls.Distinct().ToList();
        }
        catch (HttpRequestException ex)
        {
            AnsiConsole.MarkupLine($"[red]Erro ao obter lista de arquivos: {ex.Message.EscapeMarkup()}[/]");
            return [];
        }
    }

    private async Task<List<string>> DownloadAllAsync(List<string> urls, CancellationToken ct)
    {
        var results = new ConcurrentBag<string>();

        await AnsiConsole.Progress()
            .Columns(new TaskDescriptionColumn { Alignment = Justify.Left }, new ProgressBarColumn(),
                new PercentageColumn(), new RemainingTimeColumn(), new SpinnerColumn())
            .StartAsync(async ctx =>
            {
                var tasks = new Dictionary<string, ProgressTask>();
                var infos = urls.Select(u => new
                {
                    Url = u,
                    FileName = Path.GetFileName(new Uri(u).LocalPath),
                    FilePath = Path.Combine(_downloadDir, Path.GetFileName(new Uri(u).LocalPath))
                }).ToList();

                foreach (var info in infos)
                {
                    if (File.Exists(info.FilePath))
                    {
                        var t = ctx.AddTask($"[green]✓ {info.FileName} (já existe)[/]");
                        t.Value = t.MaxValue;
                        results.Add(info.FilePath);
                    }
                    else
                    {
                        tasks[info.FilePath] = ctx.AddTask($"[cyan]{info.FileName}[/]");
                    }
                }

                var toDownload = infos.Where(i => !File.Exists(i.FilePath)).ToList();
                await Parallel.ForEachAsync(toDownload, new ParallelOptions { MaxDegreeOfParallelism = Math.Max(1, AppConfig.Current.Downloader.ParallelDownloads), CancellationToken = ct },
                    async (info, token) =>
                    {
                        var task = tasks[info.FilePath];
                        var local = await DownloadOneAsync(info.Url, info.FilePath, task, token);
                        results.Add(local);
                    });
            });

        return results.ToList();
    }

    private async Task<string> DownloadOneAsync(string url, string filePath, ProgressTask task, CancellationToken ct)
    {
        const int maxRetries = 3;
        var retry = 0;

        while (true)
        {
            try
            {
                using var resp = await _http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, ct);
                resp.EnsureSuccessStatusCode();

                var total = resp.Content.Headers.ContentLength ?? 0;
                task.MaxValue = total > 0 ? total : 1_000_000; // fallback progress

                await using var src = await resp.Content.ReadAsStreamAsync(ct);
                await using var dst = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.Read, 1 << 20, useAsync: true);

                var buffer = new byte[1 << 16];
                long readTotal = 0;
                int n;
                while ((n = await src.ReadAsync(buffer.AsMemory(0, buffer.Length), ct)) > 0)
                {
                    await dst.WriteAsync(buffer.AsMemory(0, n), ct);
                    readTotal += n;
                    if (total > 0) task.Value = readTotal; else task.Increment(n);
                }

                task.Description = $"[green]✓ {Path.GetFileName(filePath)}[/]";
                task.Value = task.MaxValue;
                return filePath;
            }
            catch
            {
                retry++;
                task.Description = $"[red]✗ {Path.GetFileName(filePath)} (tentativa {retry})[/]";
                if (retry >= maxRetries) throw;
                await Task.Delay(1000 * retry, ct);
            }
        }

        throw new InvalidOperationException("Falha no download após múltiplas tentativas");
    }

    private static async Task ExtractAllAsync(List<string> zipFiles, string targetDir, CancellationToken ct)
    {
        Directory.CreateDirectory(targetDir);

        // Se já existem arquivos extraídos (CSV-like) com os padrões da RFB, pula a extração
        string[] extractedPatterns = [
            "*EMPRECSV*", "*ESTABELE*", "*SOCIOCSV*", "*SIMPLES*",
            "*CNAECSV*", "*MOTICSV*", "*MUNICCSV*", "*NATJUCSV*",
            "*PAISCSV*", "*QUALSCSV*"
        ];

        var hasExtractedAlready = extractedPatterns.Any(p =>
            Directory.EnumerateFiles(targetDir, p, SearchOption.AllDirectories).Any());

        if (hasExtractedAlready)
        {
            AnsiConsole.MarkupLine("[blue]ℹ️ Arquivos já extraídos encontrados; pulando extração.[/]");
            return;
        }

        await AnsiConsole.Progress().StartAsync(async ctx =>
        {
            foreach (var zip in zipFiles)
            {
                ct.ThrowIfCancellationRequested();
                var fileName = Path.GetFileName(zip);
                var t = ctx.AddTask($"[yellow]Extraindo {fileName}[/]", maxValue: 1);
                try
                {
                    ZipFile.ExtractToDirectory(zip, targetDir, overwriteFiles: true);
                    t.Value = 1;
                }
                catch (InvalidDataException)
                {
                    t.Description = $"[red]Arquivo corrompido: {fileName}[/]";
                }
                catch (Exception ex)
                {
                    t.Description = $"[red]Erro em {fileName}: {ex.Message.EscapeMarkup()}[/]";
                }
            }
            await Task.CompletedTask;
        });

        AnsiConsole.MarkupLine($"[green]✓ Extração concluída em {Path.GetFullPath(targetDir)}[/]");
    }
}
