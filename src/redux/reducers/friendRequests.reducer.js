const friendRequests = (state = [], action) => {
	switch (action.type) {
		case 'SET_FRIEND_REQUESTS':
			return action.payload;
		default:
			return state;
	}
};

export default friendRequests;
