// User Service for NestJS Api - All Routes
const axios = require('axios').default;

// #region - Get-Routes

export async function getUser() {
	const response = await axios.get(`${process.env.BASE_URL}/user`);
	return response.data;
}

export async function getUserById(userid) {
	const response = await axios.get(`${process.env.BASE_URL}/user/${userid}`);
	return response.data;
}

export async function getUserFollowings(userid) {
	const response = await axios.get(`${process.env.BASE_URL}/user/${userid}/followings`);
	return response.data;
}

export async function getUserFollowers(userid) {
	const response = await axios.get(`${process.env.BASE_URL}/user/${userid}/followers`);
	return response.data;
}

export async function getUserHandle(userid) {
	const response = await axios.get(`${process.env.BASE_URL}/user/${userid}/handle`);
	return response.data;
}

// #endregion

// #region - Post-Routes

export async function postUser(user) {
	await axios.post(`${process.env.BASE_URL}/user`, user);
}

export async function addUserToBubble(userid, bubbleid) {
	let userExist = await getUserById(userid);
	if (userExist.length) {
		userExist = userExist[0];
		let getBubbles = userExist.bubble;
		if (!getBubbles.find((bubble) => bubble.id === bubbleid)) {
			await axios.post(`${process.env.BASE_URL}/user/${userid}/addToBubble`, { id: `${bubbleid}` });
		}
	}
}

// #endregion

// #region - Patch-Routes

export async function updateUser(userid, user) {
	let userExist = await getUserById(userid);
	let currentDate = new Date().toISOString();
	user.lastCheck = currentDate;
	if (userExist.length) {
		try {
			await axios.patch(`${process.env.BASE_URL}/user/${userid}`, user);
		} catch (e) {
			console.log(e);
		}
	}
}

export async function updateFollowings(userid, followerList) {
	let userExist = await getUserById(userid);
	if (userExist.length) {
		try {
			await axios({
				method: 'patch',
				url: `${process.env.BASE_URL}/user/${userid}/followings`,
				data: followerList,
			});
		} catch (e) {
			console.log(e);
		}
	}
}

export async function updateFollowers(userid, followerList) {
	let userExist = await getUserById(userid);
	if (userExist.length) {
		try {
			await axios({
				method: 'patch',
				url: `${process.env.BASE_URL}/user/${userid}/followers`,
				data: followerList,
			});
		} catch (e) {
			console.log(e);
		}
	}
}

// #endregion

// #region - Delete-Routes

export async function removeUser(userid) {
	let userExist = await getUserById(userid);
	if (userExist.length) {
		try {
			await axios.delete(`${process.env.BASE_URL}/user/${userid}`);
		} catch (e) {
			console.log(e);
		}
	}
}

export async function removeUserFromBubble(userid, bubbleid) {
	let userExist = await getUserById(userid);
	if (userExist.length) {
		userExist = userExist[0];
		let getBubbles = userExist.bubble;
		if (getBubbles.find((bubble) => bubble.id === bubbleid)) {
			try {
				await axios.delete(`${process.env.BASE_URL}/user/${userid}/bubble`, { data: { id: bubbleid } });
			} catch (e) {
				console.log(e);
			}
		}
	}
}

// #endregion
