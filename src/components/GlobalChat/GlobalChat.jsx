import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../../socket/socket';
import './GlobalChat.css';
import SideBar from '../SideBar/SideBar';
import Swal from 'sweetalert2';

//? Testing
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

//? end of those testing

function GlobalChat() {
	const [message, setMessage] = useState('');
	const [editMessage, setEditMessage] = useState('');
	const [messageId, setMessageId] = useState(0);
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
		setMessage('');
	};

	const goToProfile = (id) => {
		dispatch({ type: 'GET_PROFILE', payload: id.tarkov_name });
		history.push(`/profile/${id.tarkov_name}`);
	};

	const handleDelete = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				dispatch({ type: 'DELETE_MESSAGE', payload: id });
				Swal.fire('Deleted!', 'Your message has been deleted.', 'success');
			}
		});
	};

	const handleEdit = (id) => {
		setMessageId(id.id);
		setEditMessage(id.description);
	};

	const submitEdit = () => {
		dispatch({ type: 'EDIT_MESSAGE', payload: { id: messageId, message: editMessage } });
		setEditMessage('');
		setMessageId(0);
		setMessage('');
	};

	//? Will need this use effect to load messages on page load
	//? also includes our received info from the server so that page reloads
	useEffect(() => {
		scrollToBottom();
		//? this is what server sends
		socket.on('receive_message', (data) => {
			// //? Will need to a dispatch to get all messages??
			dispatch({ type: 'GET_MESSAGES' });
			scrollToBottom();
		});
		//? Can not add scroll to bottom as a dependency in the array. Causes infinite get request to saga
	}, [socket, dispatch, messages]);

	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_MESSAGES' });
		dispatch({ type: 'GET_NOTIFICATIONS' });
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<SideBar />
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<center>
					<div className='globalChat'>
						<header>{'GLOBAL CHAT'}</header>
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
										<p className='messageDesc'>{message.description}</p>
										<p className='messageButtons'>
											<span className='editSpan' onClick={() => handleEdit(message)}>
												Edit
											</span>
											<span className='deleteSpan' onClick={() => handleDelete(message.id)}>
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
										<p className='messageDesc'>{message.description}</p>
									</>
								)}
							</div>
						))}
						<div ref={messagesEndRef} />
					</List>
					<center>
						{editMessage !== '' ? (
							<Paper
								component='form'
								sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}>
								<InputBase
									onChange={(e) => setEditMessage(e.target.value)}
									value={editMessage}
									sx={{ ml: 1, flex: 1 }}
									placeholder='Message....'
								/>
								<Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
								<Chip onClick={submitEdit} icon={<SendIcon />} label='Submit Edit' />
								<Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
								<IconButton onClick={() => setEditMessage('')} color='primary' sx={{ p: '10px' }}>
									<CloseIcon />
								</IconButton>
							</Paper>
						) : (
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
								<IconButton color='primary' sx={{ p: '10px' }}>
									<Chip onClick={sendMessage} icon={<SendIcon />} label='Send' />
								</IconButton>
							</Paper>
						)}
					</center>
				</center>
			</Box>
		</Box>
	);
}

export default GlobalChat;
