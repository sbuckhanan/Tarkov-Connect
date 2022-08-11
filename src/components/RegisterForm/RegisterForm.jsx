import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Chip from '@mui/material/Chip';

function RegisterForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [tarkov_name, setTarkovName] = useState('');
	const [level, setLevel] = useState('');
	const errors = useSelector((store) => store.errors);
	const dispatch = useDispatch();

	const registerUser = (event) => {
		event.preventDefault();

		dispatch({
			type: 'REGISTER',
			payload: {
				username: username,
				password: password,
				tarkov_name: tarkov_name,
				tarkov_level: level,
			},
		});
	}; // end registerUser

	return (
		<>
			<center>
				{errors.registrationMessage && (
					<Alert variant='filled' severity='error' sx={{ width: '40%' }}>
						{errors.registrationMessage}
					</Alert>
				)}
			</center>
			<form className='formPanel'>
				<center>
					<h2>Create New Account</h2>
					<label className='inp' htmlFor='inp'>
						<input
							id='inp'
							type='text'
							name='username'
							value={username}
							required
							onChange={(event) => setUsername(event.target.value)}
						/>
						<span className='label'>Email</span>
						<span className='focus-bg'></span>
					</label>
					<label className='inp' htmlFor='inp'>
						<input
							id='inp'
							type='password'
							name='password'
							value={password}
							required
							onChange={(event) => setPassword(event.target.value)}
						/>
						<span className='label'>Password</span>
						<span className='focus-bg'></span>
					</label>
					<label className='inp' htmlFor='inp'>
						<input
							id='inp'
							type='text'
							name='tarkovName'
							value={tarkov_name}
							required
							onChange={(event) => setTarkovName(event.target.value)}
						/>
						<span className='label'>Tarkov Name</span>
						<span className='focus-bg'></span>
					</label>
					<label className='inp' htmlFor='inp'>
						<input
							id='inp'
							type='number'
							name='level'
							value={level}
							required
							onChange={(event) => setLevel(event.target.value)}
						/>
						<span className='label'>Tarkov Level</span>
						<span className='focus-bg'></span>
					</label>
					<div>
						<Chip
							style={{ backgroundColor: 'white' }}
							onClick={registerUser}
							icon={<BorderColorIcon />}
							label='Register'
						/>
					</div>
				</center>
			</form>
		</>
	);
}

export default RegisterForm;
