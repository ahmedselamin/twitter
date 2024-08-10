namespace Twitter.Server.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
}
