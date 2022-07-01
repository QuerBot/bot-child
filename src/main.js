// Child Bot:
import 'dotenv/config';
import * as tweetService from './tweet/tweet.service';
import * as userHandler from './user/user.handler';
const CronJob = require('cron').CronJob;

import * as userService from './user/user.service';
import * as apiService from './twitter-api/api.service';

async function test() {
	console.log('Got Called');
	let nextTweet = await tweetService.getNextTweet();
	if (Object.keys(nextTweet).length === 0) {
		console.log('Went out');
		return;
	}
	await tweetService.tweetInProgress(nextTweet.tweetID);
	console.log('Set Tweet in Progress');
	let check = await userHandler.handler(nextTweet.requestedUser.id, nextTweet.tweetID);
	if (check) {
		await tweetService.doneTweet(nextTweet.tweetID);
		console.log('Sent tweet and marked it as done');
	}
}

const job = new CronJob(
	'*/10 * * * * *',
	async function () {
		await test();
	},
	null,
	false
);

job.start();

