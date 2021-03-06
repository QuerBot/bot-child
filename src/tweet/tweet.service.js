// Tweet Service for NestJS Api - All Routes
const axios = require('axios').default;
import client from '../clients/clientParent';

// #region - Get Routes
export async function getNextTweet() {
	const response = await axios.get(`${process.env.BASE_URL}/tweet`);
	return response.data;
}

// #endregion

// #region - Update/Patch Routes
export async function tweetInProgress(id) {
	await axios.patch(`${process.env.BASE_URL}/tweet/${id}/inProgress`);
}
export async function doneTweet(id) {
	await axios.patch(`${process.env.BASE_URL}/tweet/${id}/done`);
}
// #endregion

// #region - Sending Tweets
export async function sendTweet(code = 0, bubble = false, user = false, tweet = false, percentage = 0, followCount = 0) {
	let isTweetLive = await client.v2.singleTweet(tweet);
	if ('data' in isTweetLive) {
		percentage = percentage.toFixed(2);
		if (code === 0) {
		} else if (code === 1) {
			// User is part of bubble and got added
			await client.v2.reply(`In den Followings von ${user.handle} sind ${percentage}% (${followCount}) Mitglied der Bubble: "${bubble.name}". Der User wurde daher der Bubble hinzugefügt. Vielen Dank!`, tweet);
		} else if (code === 2) {
			// User is part of bubble but was already part of bubble
			await client.v2.reply(`In den Followings von ${user.handle} sind ${percentage}% (${followCount}) Mitglied der Bubble: "${bubble.name}". Der User war aber schon Teil der Bubble. Seine Followings wurden aktualisiert. Vielen Dank!`, tweet);
		} else if (code === 3) {
			// User is NOT part of bubble and was NOT added
			await client.v2.reply(`In den Followings von ${user.handle} sind nur ${percentage}% (${followCount}) Mitglied der Bubble: "${bubble.name}". Der User folgt zu wenigen Accounts und wurde daher nicht zur Bubble hinzugefügt. Vielen Dank!`, tweet);
		} else if (code === 4) {
			await client.v2.reply(`In den Followings von ${user.handle} sind zwar nur ${percentage}% (${followCount}) Mitglied der Bubble: "${bubble.name}". Der User gehört aber aus anderen Gründen zur Bubble. Vielen Dank!`, tweet);
		} else if (code === 5) {
			await client.v2.reply(`Es ist ein Fehler aufgetreten. ${user.handle} konnte nicht überprüft werden.`, tweet);
		}
		return true;
	} else {
		return false;
	}
}
// #endregion
