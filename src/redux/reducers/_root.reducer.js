import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import messages from './messages.reducer';
import receiverId from './receiver.reducer';
import privateMessages from './privateMessages.reducer';
import profile from './profile.reducer';
import currentSocketId from './socketId.reducer';
import allMessages from './allMessages.reducer';
import notificationReducer from './notifcation.reducer';
import totalNotifications from './totalNotifications.reducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
	errors, // contains registrationMessage and loginMessage
	user, // will have an id and username if someone is logged in
	messages,
	receiverId,
	privateMessages,
	profile,
	currentSocketId,
	allMessages,
	notificationReducer,
	totalNotifications,
});

export default rootReducer;
