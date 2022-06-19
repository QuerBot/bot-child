import client from '../clients/client';
const puppeteer = require('puppeteer');

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

export async function scrapeHandle(list) {
	const prefix = 'https://twitter.com/i/';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let userArray = [];
	for (let id of list) {
		let userObj = {};
		await page.goto(`https://twitter.com/i/user/${id}`, {
			waitUntil: 'networkidle2',
		});
		let url = page.url();
		if (url.startsWith(prefix)) {
			continue;
		} else {
			url = url.split('https://twitter.com/').pop();
			if (url === '404') {
				continue;
			}
			userObj.id = id;
			userObj.handle = url;
			userArray.push(userObj);
			console.log(`${userObj.handle} wurde ins Array gepusht`);
		}
	}
	await browser.close();
	return userArray;
}
