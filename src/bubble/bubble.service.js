// Bubble Service for NestJS Api - All Routes
const axios = require('axios').default;

// #region - Get-Routes

export async function getBubble() {
	const response = await axios.get(`${process.env.BASE_URL}/bubble`);
	return response.data;
}

export async function getBubbleById(id) {
	const response = await axios.get(`${process.env.BASE_URL}/bubble/${id}`);
	return response.data;
}

export async function getBubbleByName(name) {
	const response = await axios.get(`${process.env.BASE_URL}/bubble/${name}/byName`);
	return response.data;
}

export async function getBubbleMembers(id) {
	const response = await axios.get(`${process.env.BASE_URL}/bubble/${id}/members`);
	return response.data;
}

export async function getBubbleMostFollowedUsers(id, count) {
	let bubbleExist = await getBubbleById(id);
	if (bubbleExist.length) {
		const response = await axios({
			method: 'get',
			url: `${process.env.BASE_URL}/bubble/${id}/mostFollowed`,
			data: {
				count: count,
			},
		});
		return response.data;
	}
}

// #endregion

// #region - Post-Routes

export async function postBubble(bubble) {
	let bubbleExist = await getBubbleByName(bubble.name);
	if (bubbleExist.length) {
		await axios.post(`${process.env.BASE_URL}/bubble`, bubble);
		return 'Bubble was successfully added';
	}
	console.log('Bubble already exists');
}

// #endregion

// #region - Patch-Routes

export async function updateBubble(bubbleid, bubble) {
	let bubbleExist = await getBubbleById(bubbleid);
	if (bubbleExist.length) {
		try {
			await axios({
				method: 'patch',
				url: `${process.env.BASE_URL}/bubble/${bubbleid}`,
				data: bubble,
			});
		} catch (e) {
			console.log(e);
		}
	}
}

// #endregion

// #region - Delete-Routes

export async function deleteBubble(id) {
	const response = await axios.delete(`${process.env.BASE_URL}/bubble/${id}`);
	return response.data;
}

// #endregion
