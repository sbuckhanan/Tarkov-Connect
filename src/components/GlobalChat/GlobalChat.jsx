import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../../socket/socket';

function GlobalChat() {
	const [message, setMessage] = useState('');
	const messages = useSelector((store) => store.messages);
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const history = useHistory();

	const sendMessage = () => {
		//? Send to saga to post, saga will call the socket event to update everyone's DOM
		dispatch({ type: 'POST_MESSAGE', payload: { message } });
	};

	const privateMessage = (id) => {
		dispatch({ type: 'SET_RECEIVER_ID', payload: id });
		history.push('/private');
	};

	//? Will need this use effect to load messages on page load
	//? also includes our received info from the server so that page reloads
	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_MESSAGES' });
		//? this is what server sends
		socket.on('receive_message', (data) => {
			//? Will need to a dispatch to get all messages??
			dispatch({ type: 'GET_MESSAGES' });
		});
	}, [socket, dispatch]);

	return (
		<>
			<input type='text' placeholder='Message' onChange={(e) => setMessage(e.target.value)} />
			<button onClick={sendMessage}>SEND MESSAGE</button>

			{messages.map((message) => (
				<div key={message.id}>
					{message.user_id === user.id ? (
						<h2>
							ME <span>{message.time}</span>
						</h2>
					) : (
						<h2 onClick={() => privateMessage(message.user_id)}>
							{message.username} <span>{message.time}</span>
						</h2>
					)}
					<p>{message.description}</p>
				</div>
			))}
		</>
	);
}

export default GlobalChat;
