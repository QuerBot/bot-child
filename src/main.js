// Child Bot:
import 'dotenv/config';
import fs from 'fs';
import * as tweetService from './tweet/tweet.service';
import * as bubbleImporter from './bubble/bubble.importer';
const CronJob = require('cron').CronJob;

//bubbleImporter.starter('testlist.txt', process.env.BUBBLE_NAME, process.env.BUBBLE_DESC);

async function test() {
	let currentTweet = await tweetService.getNextTweet();
	await tweetService.tweetInProgress(currentTweet.tweetID);
	console.log(currentTweet.requestedUser.id);
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
