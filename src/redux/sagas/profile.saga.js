import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getProfile(action) {
	try {
		const id = yield axios.get(`/api/profile/personId/${action.payload}`);
		yield console.log('HERE IS ID FROM DB', id);
		const feedback = yield axios.get(`/api/profile/feedback/${id.data[0].id}`);
		const info = yield axios.get(`/api/profile/info/${action.payload}`);
		yield console.log('HERE IS THE FEEDBACK RESULTS', feedback.data);
		yield console.log('HERE IS THE INFO RESULTS', info.data);
		yield put({ type: 'SET_PROFILE', payload: { feedback: feedback.data, info: info.data } });
		yield put({ type: 'SET_RECEIVER_ID', payload: info.data.id });
		yield put({ type: 'GET_PRIVATE_MESSAGES', payload: info.data.id });
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

function* editFeedback(action) {
	try {
		// clear any existing error on the login page
		yield axios.put(`/api/profile/feedback`, {
			rating: action.payload.rating,
			comment: action.payload.comment,
			feedbackId: action.payload.feedbackId,
		});
		yield put({ type: 'GET_PROFILE', payload: action.payload.currentProfile });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* deleteFeedback(action) {
	try {
		// clear any existing error on the login page
		yield axios.delete(`/api/profile/feedback/${action.payload.id}`);
		yield put({ type: 'GET_PROFILE', payload: action.payload.currentProfile });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* profileSaga() {
	yield takeLatest('GET_PROFILE', getProfile);
	yield takeLatest('ADD_FEEDBACK', addFeedback);
	yield takeLatest('EDIT_FEEDBACK', editFeedback);
	yield takeLatest('DELETE_FEEDBACK', deleteFeedback);
}

export default profileSaga;
