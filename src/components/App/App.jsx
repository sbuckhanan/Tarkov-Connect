import React, { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AboutPage from '../AboutPage/AboutPage';
import InfoPage from '../InfoPage/InfoPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import socket from '../../socket/socket';
import Profile from '../Profile/Profile';
import useSound from 'use-sound';
import FinalPage from '../FinalPage/FinalPage';

import './App.css';
import GlobalChat from '../GlobalChat/GlobalChat';
import PrivateChat from '../PrivateChat/PrivateChat';

function App() {
	const dispatch = useDispatch();

	const user = useSelector((store) => store.user);

	const soundUrl = '/sounds/sound.mp3';

	const [play] = useSound(soundUrl, { volume: 0.6 });

	useEffect(() => {
		socket.disconnect();
		socket.connect();
		dispatch({ type: 'GET_NOTIFICATIONS' });
		dispatch({ type: 'ALL_MESSAGES' });
		dispatch({ type: 'GET_FRIEND_REQUESTS' });
		dispatch({ type: 'GET_FRIENDS' });
		dispatch({ type: 'FETCH_USER', payload: socket.id });
		socket.on('connect', () => {
			dispatch({ type: 'FETCH_USER', payload: socket.id });
			dispatch({ type: 'SET_CURRENT_SOCKET_ID', payload: socket.id });
			console.log(socket.id); // an alphanumeric id...
		});
		socket.on('private message', (data) => {
			play();
			dispatch({ type: 'GET_NOTIFICATIONS' });
			dispatch({ type: 'ALL_MESSAGES' });
			dispatch({ type: 'GET_FRIEND_REQUESTS' });
			dispatch({ type: 'GET_FRIENDS' });
		});
	}, [dispatch, socket]);

	return (
		<Router>
			<div>
				<Switch>
					{/* Visiting localhost:3000 will redirect to localhost:3000/home */}
					<Redirect exact from='/' to='/registration' />

					{/* Visiting localhost:3000/about will show the about page. */}
					<Route
						// shows AboutPage at all times (logged in or not)
						exact
						path='/about'>
						<AboutPage />
					</Route>

					<ProtectedRoute
						// logged in shows InfoPage else shows LoginPage
						exact
						path='/info'>
						<InfoPage />
					</ProtectedRoute>

					<ProtectedRoute
						// logged in shows InfoPage else shows LoginPage
						exact
						path='/global'>
						<GlobalChat />
					</ProtectedRoute>

					<ProtectedRoute
						// logged in shows InfoPage else shows LoginPage
						exact
						path='/global'>
						<GlobalChat />
					</ProtectedRoute>

					<ProtectedRoute
						// logged in shows InfoPage else shows LoginPage
						exact
						path='/profile/:username'>
						<Profile />
					</ProtectedRoute>

					<Route exact path='/me'>
						<FinalPage />
					</Route>

					<Route exact path='/login'>
						{user.id ? (
							// If the user is already logged in,
							// redirect to the /user page
							<Redirect to='/global' />
						) : (
							// Otherwise, show the login page
							<LoginPage />
						)}
					</Route>

					<Route exact path='/registration'>
						{user.id ? (
							// If the user is already logged in,
							// redirect them to the /user page
							<Redirect to='/global' />
						) : (
							// Otherwise, show the registration page
							<RegisterPage />
						)}
					</Route>

					{/* If none of the other routes matched, we will show a 404. */}
					<Route>
						<h1>404</h1>
					</Route>
				</Switch>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
