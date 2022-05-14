# bot-child
Child Bot of the main QuerBot to handle more than 15 Req / 15 Min

## Why?

Because Twitter API is very strict in it's rating limits. Even if you apply for educational purposes your only limit which goes up is your tweet limit, but not the rate limits.
With this setup I can connect as many Child-Bots as I want (Twitter-Accounts) and all have seperate 15 Req per 15 Min rate limits. So when Child-Bot Ones rate limit is reached the second child-bot can intervene and take it's place to process the next request.

We only get 1000 Followers/Followings per request, so people who have more than 15.000 followers can't be processed with a single bot.

This won't fit for my purposes of this bot because we have people with huge followerbases and I want to analyze the bubbles behind this.

The sad about this is, that you have to make a new Twitter-Bot-Account everytime you keep hitting your rate limits.

Just imagine how long it would take to get all followers of Elon Musk for example.

Today (14th of May 2022) he has around 93 Million followers.

To get all of them we need 93.000 requests. We only can have 15 requests per bot per 15 minutes. So we need 6200*15 Minutes with one bot (93.000 Minutes = 1550 hours = 64,58 days).

Or we need 6200 bots to get it within 15 minutes.
