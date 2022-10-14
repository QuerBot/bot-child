import * as userService from '../user/user.service';
import * as bubbleService from '../bubble/bubble.service';
import * as apiService from '../twitter-api/api.service';
import * as tweetService from '../tweet/tweet.service';

export async function handler(id, tweet) {
	let followings = await apiService.getFollowings(id, false, [], tweet);
	let bubble = await bubbleService.getBubbleById(process.env.BUBBLEID);
	bubble = bubble[0];
	let bubbleMembers = await bubbleService.getBubbleMembers(process.env.BUBBLEID);
	let userAdded = await listCompare(followings, bubbleMembers);
	console.log(userAdded);
	let userExist = await userService.getUserById(id);
	console.log(tweet);
	if (followings === false) {
		await tweetService.sendTweet(5, bubble, userExist[0], tweet);
		return true;
	} else if (userAdded.promise && userExist[0].rating === 0) {
		console.log('New User');
		let userObject = {
			id: id,
			handle: await apiService.getUserHandle(id),
			bubble: [{ id: process.env.BUBBLEID }],
			rating: 1,
		};
		await userService.postUser(userObject);
		await updateFollowings(id, followings);
		await tweetService.sendTweet(1, bubble, userExist[0], tweet, userAdded.percentage, userAdded.followCount);
		return true;
	} else if (userAdded.promise && userExist[0].rating > 0) {
		console.log('Existing User');
		let updateObject = {
			rating: userExist[0].rating + 1,
		};
		await userService.updateUser(id, updateObject);
		await updateFollowings(id, followings);
		await tweetService.sendTweet(2, bubble, userExist[0], tweet, userAdded.percentage, userAdded.followCount);
		return true;
	} else if (!userAdded.promise) {
		let userBubbles = userExist[0].bubble;
		let isBubbleMember;
		for (bubble of userBubbles) {
			if (bubble.id === process.env.BUBBLEID) {
				isBubbleMember = true;
			} else {
				continue;
			}
		}
		if (!isBubbleMember) {
			await tweetService.sendTweet(3, bubble, userExist[0], tweet, userAdded.percentage, userAdded.followCount);
		} else {
			await tweetService.sendTweet(4, bubble, userExist[0], tweet, userAdded.percentage, userAdded.followCount);
		}

		return true;
	}
	return false;
}

async function updateFollowings(id, followings) {
	let followArray = [];
	for (const user of followings) {
		let userObject = {};
		userObject.id = user.id;
		userObject.handle = user.username;
		followArray.push(userObject);
	}
	await userService.postUser(followArray);
	await userService.updateFollowings(id, followArray);
}

export async function listCompare(followings = false, bubbleMembers = false) {
	if (followings === false || bubbleMembers === false) {
		return false;
	}
	let positives = 0;
	let followLength = followings.length;
	let percentage = 0;

	for (const follow of followings) {
		let followId = follow.id;
		let userDoesFollow = bubbleMembers.filter((userObject) => userObject.id === followId).length;

		if (!userDoesFollow) {
			continue;
		}
		console.log(follow);
		positives++;
	}

	percentage = positives / (followLength / 100);

	let returnObject = {};
	let requiredPercentage = -1;

	if (followLength <= 10) {
		requiredPercentage = 50;
	} else if (followLength <= 20) {
		requiredPercentage = 25;
	} else if (followLength <= 50) {
		requiredPercentage = 15;
	} else {
		if (positives >= 15 || percentage >= 10) {
			returnObject.promise = true;
			returnObject.percentage = percentage;
			returnObject.followCount = positives;
			console.log(returnObject);
			return returnObject;
		} else {
			requiredPercentage = 10;
		}
	}

	returnObject.promise = await checkTreshhold(requiredPercentage, percentage);
	returnObject.percentage = percentage;
	returnObject.followCount = positives;
	console.log(returnObject);
	return returnObject;
}

async function checkTreshhold(requiredPercentage, percentage) {
	if (percentage >= requiredPercentage) {
		return true;
	}

	return false;
}
