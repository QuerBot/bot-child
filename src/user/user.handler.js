import * as userService from '../user/user.service';
import * as bubbleService from './bubble.service';
import * as twitterService from '../twitter-api/api.service';

export async function handler(id) {
	let token = twitterService.botCache.take('token');
	token = token.next_token;
}
