import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProfile(action) {
	try {
		// clear any existing error on the login page
		const feedback = yield axios.get(`/api/profile/feedback/${action.payload}`);
		const info = yield axios.get(`/api/profile/info/${action.payload}`);
		yield put({ type: 'SET_PROFILE', payload: { feedback: feedback.data, info: info.data } });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* addFeedback(action) {
	try {
		// clear any existing error on the login page
		yield axios.post(`/api/profile/feedback`, action.payload);
		yield put({ type: 'GET_PROFILE', payload: action.payload.receiver });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* profileSaga() {
	yield takeLatest('GET_PROFILE', getProfile);
	yield takeLatest('ADD_FEEDBACK', addFeedback);
}

export default profileSaga;
