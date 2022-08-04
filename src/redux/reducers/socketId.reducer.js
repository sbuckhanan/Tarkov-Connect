const currentSocketId = (state = 0, action) => {
	switch (action.type) {
		case 'SET_CURRENT_SOCKET_ID':
			return action.payload;
		default:
			return state;
	}
};

export default currentSocketId;
