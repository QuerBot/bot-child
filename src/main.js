// Child Bot:
import 'dotenv/config';
import * as tweetService from './tweet/tweet.service';
import * as controller from './controller';
const CronJob = require('cron').CronJob;

async function test() {
	let next = await tweetService.getNextTweet();
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
