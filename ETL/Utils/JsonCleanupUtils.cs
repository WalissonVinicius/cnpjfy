using System.Text.Json;
using System.Text.RegularExpressions;

namespace CNPJExporter.Utils;

/// <summary>
/// Utilitários para limpeza e normalização de dados JSON
/// </summary>
public static class JsonCleanupUtils
{
    /// <summary>
    /// Normaliza espaços múltiplos em uma string
    /// </summary>
    /// <param name="input">String de entrada</param>
    /// <returns>String com espaços normalizados</returns>
    public static string NormalizeSpaces(string input)
    {
        if (string.IsNullOrEmpty(input))
            return string.Empty;
            
        return Regex.Replace(input.Trim(), @"\s+", " ");
    }

    /// <summary>
    /// Limpa espaços excessivos nos campos de texto do JSON
    /// </summary>
    /// <param name="jsonContent">Conteúdo JSON</param>
    /// <returns>JSON com espaços normalizados</returns>
    public static string CleanJsonSpaces(string jsonContent)
    {
        using var doc = JsonDocument.Parse(jsonContent);
        using var stream = new MemoryStream();
        using var writer = new Utf8JsonWriter(stream, new()
        { 
            Indented = false,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });
        
        WriteElementWithCleanSpaces(doc.RootElement, writer);
        
        writer.Flush();
        return System.Text.Encoding.UTF8.GetString(stream.ToArray());
    }

    /// <summary>
    /// Escreve elemento JSON aplicando limpeza de espaços em strings
    /// </summary>
    private static void WriteElementWithCleanSpaces(JsonElement element, Utf8JsonWriter writer)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Object:
                writer.WriteStartObject();
                foreach (var property in element.EnumerateObject())
                {
                    writer.WritePropertyName(property.Name);
                    WriteElementWithCleanSpaces(property.Value, writer);
                }
                writer.WriteEndObject();
                break;
                
            case JsonValueKind.Array:
                writer.WriteStartArray();
                foreach (var item in element.EnumerateArray())
                {
                    WriteElementWithCleanSpaces(item, writer);
                }
                writer.WriteEndArray();
                break;
                
            case JsonValueKind.String:
                var stringValue = element.GetString();
                var cleanValue = NormalizeSpaces(stringValue ?? "");
                writer.WriteStringValue(cleanValue);
                break;
                
            case JsonValueKind.Number:
                if (element.TryGetInt32(out var intVal))
                    writer.WriteNumberValue(intVal);
                else if (element.TryGetInt64(out var longVal))
                    writer.WriteNumberValue(longVal);
                else if (element.TryGetDouble(out var doubleVal))
                    writer.WriteNumberValue(doubleVal);
                break;
                
            case JsonValueKind.True:
                writer.WriteBooleanValue(true);
                break;
                
            case JsonValueKind.False:
                writer.WriteBooleanValue(false);
                break;
                
            case JsonValueKind.Null:
                writer.WriteNullValue();
                break;
        }
    }
}