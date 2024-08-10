using Microsoft.AspNetCore.Mvc;
using Twitter.Server.TweetService;

namespace Twitter.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TweetController : ControllerBase
    {
        private readonly ITweetService _tweetService;

        public TweetController(ITweetService tweetService)
        {
            _tweetService = tweetService;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<Tweet>>>> GetTweets()
        {
            var response = await _tweetService.GetTweets();

            return Ok(response);
        }

        [HttpGet("id")]
        public async Task<ActionResult<ServiceResponse<Tweet>>> GetTweet(int id)
        {
            var response = await _tweetService.GetTweet(id);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<Tweet>>> CreateTweet(Tweet tweet)
        {
            var response = await _tweetService.CreateTweet(tweet);

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<Tweet>>> UpdateTweet(int id, Tweet updatedTweet)
        {
            var response = await _tweetService.UpdateTweet(id, updatedTweet);

            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteTweet(int id)
        {
            var response = await _tweetService.DeleteTweet(id);

            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

    }
}
