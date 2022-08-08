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
		console.log('Error with posting friendRequest', error);
	}
}

function* acceptFriend(action) {
	try {
		yield axios.post(`/api/friends/accept`, action.payload);
		yield axios.delete(`/api/friends/requests/${action.payload.id}`);
		//? THEN GET FRIENDS AND GET REQUESTS
		yield put({ type: 'GET_FRIENDS' });
		yield put({ type: 'GET_FRIEND_REQUESTS' });
	} catch (error) {
		console.log('Error with posting new friend', error);
	}
}

function* getFriends() {
	try {
		const myFriends = yield axios.get('/api/friends');
		yield put({ type: 'SET_FRIENDS', payload: myFriends.data });
	} catch (error) {
		console.log('Error with getting friends', error);
	}
}

function* getFriendRequests() {
	try {
		const myRequests = yield axios.get('/api/friends/requests');
		yield put({ type: 'SET_FRIEND_REQUESTS', payload: myRequests.data });
	} catch (error) {
		console.log('Error with getting friends', error);
	}
}

function* requestFriendSaga() {
	yield takeLatest('REQUEST_FRIEND', requestFriend);
	yield takeLatest('GET_FRIENDS', getFriends);
	yield takeLatest('GET_FRIEND_REQUESTS', getFriendRequests);
	yield takeLatest('ACCEPT_FRIEND', acceptFriend);
}

export default requestFriendSaga;
