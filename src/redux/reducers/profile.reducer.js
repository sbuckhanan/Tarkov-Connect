const profile = (state = {}, action) => {
	switch (action.type) {
		case 'SET_PROFILE':
			return {
				feedback: action.payload.feedback,
				user_info: action.payload.info,
				friends: action.payload.friends,
			};
		default:
			return state;
	}
};

export default profile;
