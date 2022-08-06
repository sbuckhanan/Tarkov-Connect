const totalNotifications = (state = 0, action) => {
	switch (action.type) {
		case 'SET_TOTAL_NOTIFICATIONS':
			return action.payload;
		default:
			return state;
	}
};

export default totalNotifications;
