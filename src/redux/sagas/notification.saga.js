import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getNotifications() {
	try {
		// clear any existing error on the login page
		const notifications = yield axios.get(`/api/messages/notifications`);
		const totalNotifications = yield axios.get(`/api/messages/totalNotifications`);

		yield put({ type: 'SET_NOTIFICATIONS', payload: notifications.data });
		yield put({ type: 'SET_TOTAL_NOTIFICATIONS', payload: totalNotifications.data[0].total });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* markRead(action) {
	try {
		yield axios.put(`/api/messages/notifications/${action.payload}`);
		yield put({ type: 'GET_NOTIFICATIONS' });
	} catch (error) {
		console.log('Error with get messages:', error);
	}
}

function* getNotificationsSaga() {
	yield takeLatest('GET_NOTIFICATIONS', getNotifications);
	yield takeLatest('MARK_AS_READ', markRead);
}

export default getNotificationsSaga;
