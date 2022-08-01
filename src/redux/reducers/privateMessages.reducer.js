const privateMessagesReducer = (state = [], action) => {
	switch (action.type) {
		case 'SET_PRIVATE_MESSAGES':
			return action.payload;
		default:
			return state;
	}
};

export default privateMessagesReducer;
