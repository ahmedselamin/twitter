namespace Twitter.Server.TweetService;

public interface ITweetService
{
    Task<ServiceResponse<List<Tweet>>> GetTweets();
    Task<ServiceResponse<Tweet>> GetTweet(int id);
    Task<ServiceResponse<Tweet>> CreateTweet(Tweet newTweet);
    Task<ServiceResponse<Tweet>> UpdateTweet(int id, Tweet UpdatedTweet);
    Task<ServiceResponse<bool>> DeleteTweet(int id);
}
