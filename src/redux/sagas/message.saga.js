import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import socket from '../../socket/socket';

// worker Saga: will be fired on "LOGIN" actions
function* getMessages() {
	console.log('GETTING MESSAGES IN MESSAGE SAGA');
	try {
		// clear any existing error on the login page
		const messages = yield axios.get('/api/messages');
		yield put({ type: 'SET_MESSAGES', payload: messages.data });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* getPrivateMessages() {
	try {
		// clear any existing error on the login page
		const privateMessages = yield axios.get('/api/messages/privateMessage');
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
		yield axios.post('/api/messages/privateMessage', action.payload);
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
}

export default messageSaga;
