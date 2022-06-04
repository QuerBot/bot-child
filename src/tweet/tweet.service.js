// Tweet Service for NestJS Api - All Routes
const axios = require('axios').default;

// #region - Get Routes
export async function getNextTweet() {
	const response = await axios.get(`${process.env.BASE_URL}/tweet`);
	return response.data;
}

// #region - Update/Patch Routes
export async function tweetInProgress(id) {
	await axios.patch(`${process.env.BASE_URL}/tweet/${id}/inProgress`);
}
export async function doneTweet(id) {
	await axios.patch(`${process.env.BASE_URL}/tweet/${id}/done`);
}
// #endregion
