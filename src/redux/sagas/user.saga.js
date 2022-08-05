import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser(action) {
	try {
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		};

		// the config includes credentials which
		// allow the server session to recognize the user
		// If a user is logged in, this will return their information
		// from the server session (req.user)
		const response = yield axios.get('/api/user', config);
		// console.log('HERE IS YOUR USER INFO', response);
		yield axios.put(`/api/user/socket/${response.data.id}`, { socketId: action.payload });

		// now that the session has given us a user object
		// with an id and username set the client-side user object to let
		// the client-side code know the user is logged in
		yield put({ type: 'SET_USER', payload: response.data });
	} catch (error) {
		console.log('User get request failed', error);
	}
}

function* setSocket(action) {
	try {
		yield console.log('SETTING SOCKET', action.payload);
		yield axios.put(`/api/user/socket/${action.payload.id}`, { socketId: action.payload.socketId });
	} catch (error) {
		console.log('User get request failed', error);
	}
}

function* updateUser(action) {
	try {
		yield axios.put('/api/user/', action.payload);
		yield put({ type: 'GET_PROFILE', payload: action.payload.name });
	} catch (error) {
		console.log('Error in update user', error);
	}
}

function* userSaga() {
	yield takeLatest('FETCH_USER', fetchUser);
	yield takeLatest('SET_SOCKET', setSocket);
	yield takeLatest('UPDATE_USER', updateUser);
}

export default userSaga;
