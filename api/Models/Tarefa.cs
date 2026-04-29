using System.ComponentModel.DataAnnotations;

namespace ImpactaTech.Api.Models;

public class Tarefa
{
    public int Id { get; set; }

    [Required]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [Required]
    public string Status { get; set; } = "Pendente";

    public DateTime DataCriacao { get; set; }
}
