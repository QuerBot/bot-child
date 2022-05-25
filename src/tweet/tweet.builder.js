import client from '../client';

export async function getMentions(botID) {
	let timeline = await client.v2.userMentionTimeline(botID, {
		max_results: 100,
	});

	let tweets = timeline.data.data;
	return tweets;
}

async function getUserID(userHandle) {
	let user = await client.v2.userByUsername(userHandle);
	user = user.data;
	if (!user) {
		return console.log(`${userHandle} ist entweder falsch, gesperrt oder existiert nicht.`);
	}
	return user.id;
}

async function getHandleFromTweet(tweet) {
	let text = tweet.toLowerCase();
	let checkWord = 'check ';
	if (!text.includes(checkWord)) {
		return false;
	}
	let handle = text.slice(text.indexOf(checkWord) + checkWord.length);
	if (handle.includes('@')) {
		return false;
	}
	return handle;
}

export async function builder(tweets) {
	let tweetArr = [];
	for (const tweet of tweets) {
		let handle = await getHandleFromTweet(tweet.text);
		if (!handle) {
			continue;
		}
		console.log(await getUserID(handle));

		let tweetObj = {};
	}
}
