using ImpactaTech.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImpactaTech.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Tarefa> Tarefas => Set<Tarefa>();
}
