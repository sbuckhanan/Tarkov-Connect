import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../../socket/socket';
import './GlobalChat.css';
import SideBar from '../SideBar/SideBar';

//? Testing
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

//? end of those testing

function GlobalChat() {
	const [message, setMessage] = useState('');
	const messages = useSelector((store) => store.messages);
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const history = useHistory();

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView();
	};

	const sendMessage = () => {
		//? Send to saga to post, saga will call the socket event to update everyone's DOM
		dispatch({ type: 'POST_MESSAGE', payload: { message } });
	};

	// const privateMessage = (id) => {
	// 	dispatch({ type: 'SET_RECEIVER_ID', payload: id });
	// 	history.push('/private');
	// };

	const goToProfile = (id) => {
		console.log('HERE IS THE ID', id);
		//? Dispatch to get all the user information. This includes tarkov name, level, trust rating, and their current feedbacks
		//? Also need to history push.
		//? All this info should go into one reducer
		dispatch({ type: 'GET_PROFILE', payload: id.user_id });
		history.push(`/profile/${id.tarkov_name}`);
	};

	//? Will need this use effect to load messages on page load
	//? also includes our received info from the server so that page reloads
	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_MESSAGES' });
		scrollToBottom();
		//? this is what server sends
		socket.on('receive_message', (data) => {
			//? Will need to a dispatch to get all messages??
			dispatch({ type: 'GET_MESSAGES' });
			scrollToBottom();
		});
		//? Can not add scroll to bottom as a dependency in the array. Causes infinite get request to saga
	}, [socket, dispatch, messagesEndRef.current]);

	return (
		<Box sx={{ display: 'flex' }}>
			<SideBar />
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<List id='messageScroll' style={{ maxHeight: 550, overflow: 'auto' }}>
					{messages.map((message) => (
						<div className='messageCard' key={message.id}>
							{message.user_id === user.id ? (
								<>
									<h3 className='messageName'>
										<span className='underlineName'>{message.tarkov_name}</span>
										<span className='messageTime'> {message.time}</span>
									</h3>
									<p className='messageDesc'>{message.description}</p>
									<p>
										<span className='editSpan'>Edit</span>
										<span className='deleteSpan'>Delete</span>
									</p>
								</>
							) : (
								<>
									<h3 className='messageName'>
										<span className='underlineName' onClick={() => goToProfile(message)}>
											{message.tarkov_name}
										</span>
										<span className='messageTime'> {message.time}</span>
									</h3>
									<p className='messageDesc'>{message.description}</p>
								</>
							)}
						</div>
					))}
					<div ref={messagesEndRef} />
				</List>
				<center>
					<OutlinedInput
						placeholder='Message...'
						sx={{ m: 1, width: 600 }}
						id='Message'
						label='Message'
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button onClick={sendMessage} variant='contained'>
						Send
					</Button>
				</center>
			</Box>
		</Box>
	);
}

export default GlobalChat;
