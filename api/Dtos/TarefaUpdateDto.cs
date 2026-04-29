using System.ComponentModel.DataAnnotations;

namespace ImpactaTech.Api.Dtos;

public class TarefaUpdateDto
{
    [Required]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [Required]
    public string Status { get; set; } = "Pendente";
}
