import * as userService from '../user/user.service';
import * as bubbleService from '../bubble/bubble.service';
import * as apiService from '../twitter-api/api.service';

export async function handler(id) {
	let followings = await apiService.getFollowings(id);
	let bubbleMembers = await bubbleService.getBubbleMembers(process.env.BUBBLEID);
	let userAdded = await listCompare(followings, bubbleMembers);
	let userExist = await userService.getUserById(id);
	if (userAdded && !userExist.length) {
		let userObject = {
			id: id,
			handle: await apiService.getUserHandle(id),
			bubble: [{ id: process.env.BUBBLEID }],
			rating: 0,
		};
		await userService.postUser(userObject);
	} else if (userAdded && userExist.length) {
		let updateObject = {
			rating: userExist.rating + 1,
		};
		await userService.updateUser(id, updateObject);
	}
}

async function listCompare(followings, bubbleMembers) {
	let positives = 0;
	let followLength = followings.length;
	let percentage = 0;

	for (const follow of followings) {
		let followId = follow.id;
		let userDoesFollow = bubbleMembers.filter((userObject) => userObject.id === followId).length;

		if (!userDoesFollow) {
			continue;
		}

		positives++;
	}

	percentage = positives / (followLength / 100);

	let requiredPercentage = -1;

	if (followLength <= 10) {
		requiredPercentage = 50;
	} else if (followLength <= 20) {
		requiredPercentage = 25;
	} else if (followLength <= 50) {
		requiredPercentage = 15;
	} else {
		if (positives >= 15 || percentage >= 10) {
			return true;
		} else {
			requiredPercentage = 10;
		}
	}

	return await checkTreshhold(requiredPercentage, percentage);
}

async function checkTreshhold(requiredPercentage, percentage) {
	if (percentage >= requiredPercentage) {
		return true;
	}

	return false;
}
