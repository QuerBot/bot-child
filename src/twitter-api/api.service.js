import client from '../clients/client';
const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');
export const botCache = new NodeCache({ checkperiod: 900 });

export async function getUserID(userHandle) {
	let user = await client.v2.userByUsername(userHandle);
	user = user.data;
	if (!user) {
		return false;
	}
	return user.id;
}

export async function getUserHandle(id) {
	let user = await client.v2.user(id);
	user = user.data;
	if (!user) {
		return false;
	}
	return user.username;
}

export async function getFollowings(id, token) {
	let options = {};
	if (token === undefined) {
		token = {};
	}
	if (token.next_token) {
		options = {
			asPaginator: true,
			max_results: 1000,
			pagination_token: token.next_token,
		};
	} else {
		options = {
			asPaginator: true,
			max_results: 1000,
		};
	}

	const followings = await client.v2.following(id, options);

	let rateLimit = followings._rateLimit;
	let nextToken = followings._realData.meta;
	botCache.set('rate', rateLimit);
	botCache.set('token', nextToken);

	let followingList = [];
	for (const follows of followings._realData.data) {
		followingList.push(follows);
	}

	return followingList;
}

export async function scrapeHandle(list) {
	const prefix = 'https://twitter.com/i/';
	let browser = await puppeteer.launch({
		headless: true,
	});
	let page = await browser.newPage();
	let userArray = [];
	let count = 0;
	for (let i = 0; i <= list.length; i++) {
		count++;

		if (count === 240) {
			await browser.close();
			browser = await puppeteer.launch({
				headless: true,
			});
			page = await browser.newPage();

			await new Promise((resolve) => setTimeout(resolve, 5000));
			count = 0;
		}

		const id = list[i];
		let userObj = {};
		await page.goto(`https://twitter.com/i/user/${id}`, {
			waitUntil: 'networkidle2',
			timeout: 0,
		});
		let url = page.url();
		if (url.startsWith(prefix)) {
			console.log(`- - - - - - Nr: ${i}: wurde nicht aufgelöst/weitergeleitet. - - - - - -`);
			continue;
		} else {
			url = url.split('https://twitter.com/').pop();
			if (url === '404') {
				console.log(`- - - - - - Nr: ${i}: wurde nicht gefunden. 404. - - - - - -`);
				continue;
			}
			userObj.id = id;
			userObj.handle = url;
			userArray.push(userObj);
			console.log(`Nr: ${i}: ${userObj.handle} wurde ins Array gepusht`);
		}
	}
	await browser.close();
	return userArray;
}
