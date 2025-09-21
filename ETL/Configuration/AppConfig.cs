using System.Text.Json;

namespace CNPJExporter.Configuration;

public class AppConfig
{
    public PathsConfig Paths { get; set; } = new();
    public RcloneSettings Rclone { get; set; } = new();
    public DuckDbSettings DuckDb { get; set; } = new();
    public NdjsonSettings Ndjson { get; set; } = new();
    public DownloaderSettings Downloader { get; set; } = new();

    public class PathsConfig
    {
        public string DataDir { get; set; } = string.Empty;
        public string ParquetDir { get; set; } = string.Empty;
        public string OutputDir { get; set; } = string.Empty;
        public string DownloadDir { get; set; } = string.Empty;
        public string HashCacheDir { get; set; } = string.Empty;
    }

    public class RcloneSettings
    {
        public string RemoteBase { get; set; } = string.Empty;
        public int Transfers { get; set; } = 0;
        public int MaxConcurrentUploads { get; set; } = 0;
    }

    public class DuckDbSettings
    {
        public bool UseInMemory { get; set; } = false;
        public int ThreadsPragma { get; set; } = 0;
        public string MemoryLimit { get; set; } = string.Empty;
        public int EngineThreads { get; set; } = 0;
        public bool PreserveInsertionOrder { get; set; } = false;
    }

    public class NdjsonSettings
    {
        public int BatchUploadSize { get; set; } = 0;
        public bool NormalizeBeforeHash { get; set; } = false;
        public bool WriteJsonFiles { get; set; } = false;
        public int MaxParallelProcessing { get; set; } = 0;
    }

    public class DownloaderSettings
    {
        public int ParallelDownloads { get; set; } = 0;
    }

    public static AppConfig Current { get; private set; } = new();

    public static AppConfig Load(string? path = null)
    {
        var configPath = path ?? Path.Combine(Environment.CurrentDirectory, "config.json");
        try
        {
            if (File.Exists(configPath))
            {
                var json = File.ReadAllText(configPath);
                var cfg = JsonSerializer.Deserialize<AppConfig>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                if (cfg != null)
                {
                    Current = cfg;
                    return Current;
                }
            }
        }
        catch
        {
        }
        Current = new();
        return Current;
    }
}
