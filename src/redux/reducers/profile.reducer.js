const profile = (state = {}, action) => {
	switch (action.type) {
		case 'SET_PROFILE':
			return { feedback: action.payload.feedback, user_info: action.payload.info };
		default:
			return state;
	}
};

export default profile;
