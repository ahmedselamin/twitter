namespace Twitter.Server.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Tweet> Tweets { get; set; }
}
