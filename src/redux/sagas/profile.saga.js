import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProfile(action) {
	try {
		// clear any existing error on the login page
		const profile = yield axios.get('/api/messages');
		yield put({ type: 'SET_MESSAGES', payload: messages.data });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* messageSaga() {
	yield takeLatest('GET_PROFILE', getProfile);
}

export default messageSaga;
