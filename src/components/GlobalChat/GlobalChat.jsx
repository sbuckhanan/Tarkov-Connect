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
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

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
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_MESSAGES' });
		dispatch({ type: 'GET_NOTIFICATIONS' });
		scrollToBottom();
		//? this is what server sends
		socket.on('receive_message', (data) => {
			// //? Will need to a dispatch to get all messages??
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
										<span className='underlineName' onClick={() => goToProfile(message)}>
											{message.tarkov_name}
										</span>
										<span className='messageTime'> {message.time}</span>
									</h3>
									<p className='messageDesc'>{message.description}</p>
									<p>
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
						<>
							<OutlinedInput
								value={editMessage}
								placeholder='Message...'
								sx={{ m: 1, width: 600 }}
								id='Message'
								label='Message'
								onChange={(e) => setEditMessage(e.target.value)}
							/>
							<Button onClick={submitEdit} variant='contained'>
								SUBMIT EDIT
							</Button>
						</>
					) : (
						<>
							<OutlinedInput
								value={message}
								placeholder='Message...'
								sx={{ m: 1, width: 600 }}
								id='Message'
								label='Message'
								onChange={(e) => setMessage(e.target.value)}
							/>
							<Button onClick={sendMessage} variant='contained'>
								Send
							</Button>
						</>
					)}
				</center>
			</Box>
		</Box>
	);
}

export default GlobalChat;
