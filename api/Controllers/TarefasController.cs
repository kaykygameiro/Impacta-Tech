using ImpactaTech.Api.Data;
using ImpactaTech.Api.Dtos;
using ImpactaTech.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImpactaTech.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarefasController : ControllerBase
{
    private readonly AppDbContext _context;

    public TarefasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas()
    {
        var tarefas = await _context.Tarefas
            .AsNoTracking()
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return Ok(tarefas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Tarefa>> GetTarefa(int id)
    {
        var tarefa = await _context.Tarefas
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa == null)
        {
            return NotFound();
        }

        return Ok(tarefa);
    }

    [HttpPost]
    public async Task<ActionResult<Tarefa>> PostTarefa(TarefaCreateDto dto)
    {
        if (!TryNormalizeStatus(dto.Status, out var status))
        {
            return BadRequest("Status deve ser 'Pendente' ou 'Concluida'.");
        }

        var tarefa = new Tarefa
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Status = status,
            DataCriacao = DateTime.UtcNow
        };

        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTarefa), new { id = tarefa.Id }, tarefa);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> PutTarefa(int id, TarefaUpdateDto dto)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);
        if (tarefa == null)
        {
            return NotFound();
        }

        if (!TryNormalizeStatus(dto.Status, out var status))
        {
            return BadRequest("Status deve ser 'Pendente' ou 'Concluida'.");
        }

        tarefa.Titulo = dto.Titulo;
        tarefa.Descricao = dto.Descricao;
        tarefa.Status = status;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTarefa(int id)
    {
        var tarefa = await _context.Tarefas.FindAsync(id);
        if (tarefa == null)
        {
            return NotFound();
        }

        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static bool TryNormalizeStatus(string? status, out string normalized)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            normalized = string.Empty;
            return false;
        }

        if (status.Equals("Pendente", StringComparison.OrdinalIgnoreCase))
        {
            normalized = "Pendente";
            return true;
        }

        if (status.Equals("Concluida", StringComparison.OrdinalIgnoreCase))
        {
            normalized = "Concluida";
            return true;
        }

        normalized = string.Empty;
        return false;
    }
}
