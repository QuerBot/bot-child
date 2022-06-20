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
	await makeArrayFromList(file, bubbleName);
}

async function makeArrayFromList(list, bubbleName) {
	list = list.split(/\r?\n/).slice(0, -1);
	await buildUser(list, bubbleName);
}

async function buildUser(list, bubbleName) {
	let users = await twitterService.scrapeHandle(list);
	let bubbleId = await bubbleService.getBubbleByName(bubbleName);
	bubbleId = bubbleId[0].id;
	let userArray = [];
	for (let user of users) {
		let pushUser = {
			id: user.id,
			handle: user.handle,
			rating: 0,
			bubble: [{ id: bubbleId }],
		};
		let checkUser = await userService.getUserById(user.id);
		if (checkUser.length) {
			let userBubbles = checkUser[0].bubble;
			if (userBubbles.length) {
				for (let bubble of userBubbles) {
					if (!bubble.id === bubbleId) {
						await userService.addUserToBubble(pushUser.id, bubbleId);
						continue;
					}
				}
			} else {
				await userService.addUserToBubble(pushUser.id, bubbleId);
				continue;
			}
			continue;
		}
		userArray.push(pushUser);
	}
	if (userArray.length) {
		await userService.postUser(userArray);
	}
}
