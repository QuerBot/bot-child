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

export async function getFollowings(id = false, token = false, list = []) {
	if (!id) {
		return false; // If theres no ID stop the script immediately
	}

	let checkUser = await getUserHandle(id);
	if (!checkUser) {
		return false; // If user doesn't exist, stop the script immediately
	}

	let options = {
		asPaginator: true,
		max_results: 1000,
	};
	if (token && token === 'end') {
		return list;
	} else if (token) {
		options.pagination_token = token;
	}

	let currentList = list;
	let followings;
	let rateLimit;
	let nextToken = {};

	try {
		followings = await client.v2.following(id, options);
		rateLimit = followings._rateLimit;
		nextToken = followings._realData.meta;
		if (nextToken.result_coint > 0) {
			for (const follows of followings._realData.data) {
				currentList.push(follows);
			}
		} else {
			return false;
		}
	} catch (e) {
		if (e.data !== undefined && e.data.status !== undefined && e.data.status === 429) {
			rateLimit = e.rateLimit;
			let currentDate = Date.now();
			currentDate = Math.floor(currentDate / 1000);
			let difference = rateLimit.reset - currentDate;
			difference = (difference + 5) * 1000;
			await new Promise((resolve) => setTimeout(resolve, difference));
			nextToken.next_token = token;
		} else {
			console.log(e);
		}
	}

	if ('next_token' in nextToken) {
		return await getFollowings(id, nextToken.next_token, currentList);
	}

	return currentList;
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
