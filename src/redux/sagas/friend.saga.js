import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import socket from '../../socket/socket';

function* requestFriend(action) {
	try {
		yield axios.post(`/api/friends`, action.payload);
		yield axios.post('/api/messages/notifications', {
			name: action.payload.name,
			receiverId: action.payload.receiverId,
			message: action.payload.message,
		});
		yield socket.emit('send_private_message', action.payload);
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* requestFriendSaga() {
	yield takeLatest('REQUEST_FRIEND', requestFriend);
}

export default requestFriendSaga;
