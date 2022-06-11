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
	list.split(/\r?\n/).forEach((id) => {
		if (!id.length) {
			return false;
		}
		setTimeout(buildUser, 1000, id, bubbleName);
	});
}

async function buildUser(id, bubbleName) {
	console.log('got called');
	let handle = await twitterService.getUserHandle(id);
	let bubbleId = await bubbleService.getBubbleByName(bubbleName);
	bubbleId = bubbleId[0].id;
	let user = {
		id: id,
		handle: handle,
		rating: 0,
		bubble: [{ id: bubbleId }],
	};
	await userService.postUser(user);
}
