
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
            response.Data = await _context.Tweets
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
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
                response.Message = "Not found";
                return response;
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

            response.Message = "Tweet Created";
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
                return response;
            }

            tweet.Title = UpdatedTweet.Title;
            tweet.Description = UpdatedTweet.Description;

            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Updated Successfully";
            response.Data = tweet;
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
                return response;
            }

            _context.Tweets.Remove(tweet);
            await _context.SaveChangesAsync();

            response.Message = "Deleted Successfully.";
            response.Data = true;
        }
        catch (Exception ex)
        {
            response.Success = false;
            response.Message = ex.Message;
        }

        return response;
    }
}
