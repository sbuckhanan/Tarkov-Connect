import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
		<form className='formPanel' onSubmit={registerUser}>
			<center>
				<h2>Create New Account</h2>
				{errors.registrationMessage && (
					<h3 className='alert' role='alert'>
						{errors.registrationMessage}
					</h3>
				)}
				<div>
					<label htmlFor='username'>
						Email:
						<input
							type='text'
							name='username'
							value={username}
							required
							onChange={(event) => setUsername(event.target.value)}
						/>
					</label>
				</div>
				<div>
					<label htmlFor='password'>
						Password:
						<input
							type='password'
							name='password'
							value={password}
							required
							onChange={(event) => setPassword(event.target.value)}
						/>
					</label>
				</div>
				<div>
					<label htmlFor='tarkovName'>
						Tarkov Name:
						<input
							type='text'
							name='tarkovName'
							value={tarkov_name}
							required
							onChange={(event) => setTarkovName(event.target.value)}
						/>
					</label>
				</div>
				<div>
					<label htmlFor='level'>
						Tarkov Level:
						<input
							type='number'
							name='level'
							value={level}
							required
							onChange={(event) => setLevel(event.target.value)}
						/>
					</label>
				</div>
				<div>
					<input className='btn' type='submit' name='submit' value='Register' />
				</div>
			</center>
		</form>
	);
}

export default RegisterForm;
