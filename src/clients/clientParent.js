import { TwitterApi } from 'twitter-api-v2';

export default new TwitterApi({
	appKey: process.env.API_KEY_PARENT,
	appSecret: process.env.API_SECRET_PARENT,
	accessToken: process.env.ACCESS_TOKEN_PARENT,
	accessSecret: process.env.ACCESS_TOKEN_SECRET_PARENT,
});
