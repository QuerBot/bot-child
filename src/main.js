// Child Bot:
import 'dotenv/config';
import fs from 'fs';
//import * as tweetService from './tweet/tweet.service';
//import * as bubbleImporter from './bubble/bubble.importer';
import * as apiService from './twitter-api/api.service';
const CronJob = require('cron').CronJob;

//bubbleImporter.starter('testlist.txt', process.env.BUBBLE_NAME, process.env.BUBBLE_DESC);


async function userHandler(id) {
	let followings = await apiService.getFollowings(id);
	console.table(followings);
}

//userHandler(process.env.EXAMPLE_USRID);
//userHandler('1337');

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
