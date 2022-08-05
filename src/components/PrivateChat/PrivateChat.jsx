import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import socket from '../../socket/socket';
import SideBar from '../SideBar/SideBar';

//? Testing
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

function PrivateChat() {
	const [message, setMessage] = useState('');
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const receiverId = useSelector((store) => store.receiverId);
	const messages = useSelector((store) => store.privateMessages);
	const history = useHistory();
	const profile = useSelector((store) => store.profile);
	const { username } = useParams();

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView();
	};

	const sendMessage = () => {
		//? Send to saga to post, saga will call the socket event to update everyone's DOM
		dispatch({
			type: 'POST_PRIVATE_MESSAGE',
			payload: { message, receiverId, socketId: profile.user_info.socketId },
		});
	};

	const goToProfile = (id) => {
		console.log('HERE IS THE ID', id);
		dispatch({ type: 'GET_PROFILE', payload: id.user_id });
		history.push(`/profile/${id.tarkov_name}`);
	};

	//? Will need this use effect to load messages on page load
	//? also includes our received info from the server so that page reloads
	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_PROFILE', payload: username });
		scrollToBottom();
		//? this is what server sends
		socket.on('get_private_messages', (data) => {
			//? Will need to a dispatch to get all messages??
			dispatch({ type: 'GET_PRIVATE_MESSAGES', payload: receiverId });
			scrollToBottom();
		});
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
										<span className='underlineName' onClick={() => goToProfile(message)}>
											{message.tarkov_name}
										</span>
										<span className='messageTime'> {message.time}</span>
									</h3>
									<p className='messageDesc'>{message.message}</p>
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
									<p className='messageDesc'>{message.message}</p>
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

export default PrivateChat;
