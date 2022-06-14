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

export async function scrapeHandle(id) {
	const prefix = 'https://twitter.com/i/';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(`https://twitter.com/i/user/${id}`, {
		waitUntil: 'networkidle2',
	});
	let url = page.url();
	await browser.close();
	if (url.startsWith(prefix)) {
		return false;
	} else {
		url = url.split('https://twitter.com/').pop();
		return url;
	}
}
