import * as userService from '../user/user.service';
import * as bubbleService from './bubble.service';
import * as twitterService from '../twitter-api/api.service';
import fs from 'fs';

export async function starter(fileName, bubbleName, bubbleDesc) {
	let file = fs.readFileSync(`src/assets/${fileName}`, 'utf-8');
	let bubble = {
		name: bubbleName,
		description: bubbleDesc,
	};
	await bubbleService.postBubble(bubble);
	await listIterator(file, bubbleName);
}

async function listIterator(list, bubbleName) {
	list = list.split(/\r?\n/).slice(0, -1);
	for (let id of list) {
		await buildUser(id, bubbleName);
	}
}

async function buildUser(id, bubbleName) {
	let handle = await twitterService.scrapeHandle(id);
	let bubbleId = await bubbleService.getBubbleByName(bubbleName);
	bubbleId = bubbleId[0].id;
	let user = {
		id: id,
		handle: handle,
		rating: 0,
		bubble: [{ id: bubbleId }],
	};
	if (handle === false) {
		return false;
	} else {
		await userService.postUser(user);
	}
}
