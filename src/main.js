// Child Bot:
import 'dotenv/config';
import fs from 'fs';
//import * as tweetService from './tweet/tweet.service';
//import * as bubbleImporter from './bubble/bubble.importer';
import * as apiService from './twitter-api/api.service';
const CronJob = require('cron').CronJob;

//bubbleImporter.starter('testlist.txt', process.env.BUBBLE_NAME, process.env.BUBBLE_DESC);

async function test() {
	let testUser = process.env.EXAMPLE_USER;
	let testUserId = await apiService.getUserID(testUser);

	console.log('Running getFollowings() for the first time NOW:');
	let followingList = await apiService.getFollowings(testUserId);

	let currentRate = apiService.botCache.get('rate');
	let currentToken = apiService.botCache.get('token');
	console.log(`${currentRate.remaining} übrig und ${currentRate.reset} timer nach erstem Durchlauf`);
	console.log(`${currentToken.next_token} ist der nächste und erste Token`);
	currentToken = currentToken.next_token;

	let counter = 0;
	console.log('Before while-loop');
	while (currentToken !== undefined) {
		counter = counter + 1;
		console.log(`We are in ${counter} round`);
		let loopList;
		apiService.botCache.take('token');
		apiService.botCache.take('rate');
		if (currentRate.remaining > 0) {
			console.log('currentRate above 0 - sending next Followings');
			loopList = await apiService.getFollowings(testUserId, currentToken);
		} else {
			console.log('currentRate 0 or beloe');
			let currentDate = Date.now();
			let difference = currentRate.reset - currentDate;
			difference = (difference + 1) * 1000;
			await new Promise((resolve) => setTimeout(resolve, difference));
			loopList = await apiService.getFollowings(testUserId, currentToken);
		}
		console.log(`before getting next token: ${currentToken} with Ratelimit: ${currentRate.remaining} und Timestamp: ${currentRate.reset}`);
		currentToken = apiService.botCache.get('token').next_token;
		currentRate = apiService.botCache.get('rate');
		console.log(`after getting next token: ${currentToken} with Ratelimit: ${currentRate.remaining} und Timestamp: ${currentRate.reset}`);
		followingList.push(...loopList);
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}
	console.log(followingList.length);
}

test();

const job = new CronJob(
	'*/10 * * * * *',
	async function () {
		let mentions = await controller.getMentions(process.env.BOT_ID);
		await controller.builder(mentions);
	},
	null,
	false
);

//job.start();
