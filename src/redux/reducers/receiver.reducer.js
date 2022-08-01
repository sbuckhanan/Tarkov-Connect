const receiverId = (state = 0, action) => {
	switch (action.type) {
		case 'SET_RECEIVER_ID':
			return action.payload;
		default:
			return state;
	}
};

export default receiverId;
