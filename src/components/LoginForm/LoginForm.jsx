import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';
import Chip from '@mui/material/Chip';

function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const errors = useSelector((store) => store.errors);
	const socketId = useSelector((store) => store.currentSocketId);
	const dispatch = useDispatch();

	const login = (event) => {
		event.preventDefault();

		if (username && password) {
			dispatch({
				type: 'LOGIN',
				payload: {
					username: username,
					password: password,
					socketId: socketId,
				},
			});
		} else {
			dispatch({ type: 'LOGIN_INPUT_ERROR' });
		}
	}; // end login

	return (
		<>
			<center>
				{errors.loginMessage && (
					<Alert variant='filled' severity='error' sx={{ width: '40%' }}>
						{errors.loginMessage}
					</Alert>
				)}
			</center>
			<form className='formPanelLogin' onSubmit={login}>
				<center>
					<h2>Welcome!</h2>
					<label class='inp' htmlFor='inp'>
						<input
							id='inp'
							type='text'
							name='username'
							required
							value={username}
							onChange={(event) => setUsername(event.target.value)}
						/>
						<span class='label'>Email</span>
						<span class='focus-bg'></span>
					</label>
					<label class='inp' htmlFor='inp'>
						<input
							id='inp'
							type='password'
							name='password'
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
						<span class='label'>Password</span>
						<span class='focus-bg'></span>
					</label>
					<div>
						<Chip
							style={{ backgroundColor: 'white' }}
							onClick={login}
							icon={<LoginIcon />}
							label='Login'
						/>
					</div>
				</center>
			</form>
		</>
	);
}

export default LoginForm;
