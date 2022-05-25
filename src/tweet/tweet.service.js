// Tweet Service for NestJS Api - All Routes
const axios = require('axios').default;

// #region - Get Routes
export async function getNextTweet() {
	const response = await axios.get(`${process.env.BASE_URL}/tweet`);
	return response.data;
}
// #endregion

// #region - Post Routes
export async function queueTweet(tweet) {
	await axios.post(`${process.env.BASE_URL}/tweet`, tweet);
}
// #endregion

// #region - Update/Patch Routes
export async function doneTweet(id) {
	await axios.patch(`${process.env.BASE_URL}/tweet`, id);
}
// #endregion
