
namespace Twitter.Server.TweetService;

public class TweetService : ITweetService
{
    private readonly DataContext _context;

    public TweetService(DataContext context)
    {
        _context = context;
    }

    public async Task<ServiceResponse<List<Tweet>>> GetTweets()
    {
        var response = new ServiceResponse<List<Tweet>>();
        try
        {
            response.Data = await _context.Tweets.ToListAsync();
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<ServiceResponse<Tweet>> GetTweet(int id)
    {
        var response = new ServiceResponse<Tweet>();
        try
        {
            var tweet = await _context.Tweets.FindAsync(id);

            if (tweet == null)
            {
                response.Success = false;
                response.Message = "Not Found";
            }

            response.Data = tweet;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<ServiceResponse<Tweet>> CreateTweet(Tweet newTweet)
    {
        var response = new ServiceResponse<Tweet>();
        try
        {
            _context.Tweets.Add(newTweet);

            await _context.SaveChangesAsync();

            response.Data = newTweet;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<ServiceResponse<Tweet>> UpdateTweet(int id, Tweet UpdatedTweet)
    {
        var response = new ServiceResponse<Tweet>();
        try
        {
            var tweet = await _context.Tweets.FindAsync(id);

            if (tweet == null)
            {
                response.Success = false;
                response.Message = "Not found";
            }

            tweet.Title = UpdatedTweet.Title;
            tweet.Description = UpdatedTweet.Description;

            response.Data = UpdatedTweet;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }

    public async Task<ServiceResponse<bool>> DeleteTweet(int id)
    {
        var response = new ServiceResponse<bool>();
        try
        {
            var tweet = await _context.Tweets.FindAsync(id);

            if (tweet == null)
            {
                response.Success = false;
                response.Message = "Not found";
            }

            _context.Tweets.Remove(tweet);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }
}
