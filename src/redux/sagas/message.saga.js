import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import socket from '../../socket/socket';

// worker Saga: will be fired on "LOGIN" actions
function* getMessages() {
	try {
		// clear any existing error on the login page
		const messages = yield axios.get('/api/messages');
		yield put({ type: 'SET_MESSAGES', payload: messages.data });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* deleteMessage(action) {
	try {
		// clear any existing error on the login page
		yield axios.delete(`/api/messages/${action.payload}`);
		yield yield socket.emit('send_message', action.payload);
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* editMessage(action) {
	try {
		// clear any existing error on the login page
		yield axios.put(`/api/messages/${action.payload.id}`, { message: action.payload.message });
		yield yield socket.emit('send_message', action.payload);
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* myMessages() {
	try {
		// clear any existing error on the login page
		const messages = yield axios.get('/api/messages/all');
		yield put({ type: 'SET_ALL_MESSAGES', payload: messages.data });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* getPrivateMessages(action) {
	try {
		// clear any existing error on the login page
		const privateMessages = yield axios.get(`/api/messages/privateMessage/${action.payload}`);
		yield put({ type: 'SET_PRIVATE_MESSAGES', payload: privateMessages.data });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* postMessage(action) {
	try {
		yield axios.post('/api/messages', action.payload);
		yield socket.emit('send_message', action.payload);
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* postPrivateMessage(action) {
	try {
		yield axios.post('/api/messages/privateMessage', {
			message: action.payload.message,
			receiverId: action.payload.receiverId,
			socketId: action.payload.socketId,
		});
		//! POST NEW NOTIFICATION HERE TOO!!!!
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

function* messageSaga() {
	yield takeLatest('GET_MESSAGES', getMessages);
	yield takeLatest('GET_PRIVATE_MESSAGES', getPrivateMessages);
	yield takeLatest('POST_MESSAGE', postMessage);
	yield takeLatest('POST_PRIVATE_MESSAGE', postPrivateMessage);
	yield takeLatest('ALL_MESSAGES', myMessages);
	yield takeLatest('DELETE_MESSAGE', deleteMessage);
	yield takeLatest('EDIT_MESSAGE', editMessage);
}

export default messageSaga;
