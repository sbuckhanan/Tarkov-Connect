import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import socket from '../../socket/socket';
import SideBar from '../SideBar/SideBar';

//? Testing

import { Box, Toolbar, List, Paper, InputBase, Divider, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

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
			payload: {
				message,
				receiverId,
				socketId: profile.user_info.socketId,
				name: user.tarkov_name,
			},
		});
		setMessage('');
	};

	const goToProfile = (id) => {
		console.log('HERE IS THE ID', id);
		dispatch({ type: 'GET_PROFILE', payload: id.user_id });
		history.push(`/profile/${id.tarkov_name}`);
	};

	const handleEdit = (id) => {
		console.log('EDITING');
	};

	const handleDelete = (id) => {
		dispatch({ type: 'DELETE_PRIVATE_MESSAGE', payload: id });
	};

	//? Will need this use effect to load messages on page load
	//? also includes our received info from the server so that page reloads
	useEffect(() => {
		//? this is what server sends
		socket.on('get_private_messages', (data) => {
			//? Will need to a dispatch to get all messages??
			dispatch({ type: 'GET_PRIVATE_MESSAGES', payload: receiverId });
		});
		scrollToBottom();
	}, [socket, dispatch, messages]);

	useEffect(() => {
		// 👇️ scroll to bottom every time messages change
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_PROFILE', payload: username });
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<SideBar />
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<center>
					<div className='globalChat'>
						<header>Private Chat with @{profile.user_info?.tarkov_name}</header>
					</div>
					<List id='messageScroll' style={{ maxHeight: 500, overflow: 'auto' }}>
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
										<p className='messageButtons'>
											<span onClick={() => handleEdit(message.id)} className='editSpan'>
												Edit
											</span>
											<span onClick={() => handleDelete(message.id)} className='deleteSpan'>
												Delete
											</span>
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
						<Paper
							component='form'
							sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}>
							<InputBase
								onChange={(e) => setMessage(e.target.value)}
								value={message}
								sx={{ ml: 1, flex: 1 }}
								placeholder='Message....'
							/>
							<Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
							<Chip onClick={sendMessage} icon={<SendIcon />} label='Send' />
						</Paper>
					</center>
				</center>
			</Box>
		</Box>
	);
}

export default PrivateChat;
