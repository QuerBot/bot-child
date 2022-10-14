// Child Bot:
import 'dotenv/config';
import * as tweetService from './tweet/tweet.service';
import * as userHandler from './user/user.handler';

import * as apiService from './twitter-api/api.service';
import * as bubbleService from './bubble/bubble.service';
const CronJob = require('cron').CronJob;

async function test() {
	console.log('Got Called');
	let nextTweet = await tweetService.getNextTweet();
	if (Object.keys(nextTweet).length === 0) {
		console.log('Went out');
		return;
	}
	//await tweetService.tweetInProgress(nextTweet.tweetID);
	//console.log('Set Tweet in Progress');
	let check = await userHandler.handler(nextTweet.requestedUser.id, nextTweet.tweetID);
	if (check) {
		await tweetService.doneTweet(nextTweet.tweetID);
		console.log('Sent tweet and marked it as done');
	}
}

//test();

const job = new CronJob(
	'*/60 * * * * *',
	async function () {
		await test();
	},
	null,
	false
);

//job.start();

async function tester() {
	let example = await apiService.getUserID('OgrimFarthammer');
	let follows = await apiService.getFollowings(example);
	let bubble = await bubbleService.getBubbleMembers(process.env.BUBBLEID);
	await userHandler.listCompare(follows, bubble);
}

tester();

