import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../../socket/socket';
import './GlobalChat.css';

//? Testing
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MessageIcon from '@mui/icons-material/Message';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

const drawerWidth = 280;
//? end of those testing

function GlobalChat() {
	const [message, setMessage] = useState('');
	const messages = useSelector((store) => store.messages);
	const dispatch = useDispatch();
	const user = useSelector((store) => store.user);
	const history = useHistory();

	const [messageOpen, setMessageOpen] = useState(false);
	const [friendOpen, setFriendOpen] = useState(false);

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
		//? Dispatch to get all the user information. This includes tarkov name, level, trust rating, and their current feedbacks
		//? Also need to history push.
		//? All this info should go into one reducer
		dispatch({ type: 'GET_PROFILE', payload: id });
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
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
				<Toolbar>
					<Typography variant='h6' noWrap component='div'>
						Tarkov Connect
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant='permanent'
				anchor='left'>
				<Toolbar />
				{user.tarkov_name}
				<Divider />
				<List>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary='Home' />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding></ListItem>
					<ListItemButton onClick={() => setFriendOpen(!friendOpen)}>
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary='Friends' />
						{friendOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={friendOpen} timeout='auto' unmountOnExit>
						<List component='div' style={{ maxHeight: 150, overflow: 'auto' }} disablePadding>
							<ListItem alignItems='flex-start'>
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'>
												Ali Connors
											</Typography>
										</>
									}
								/>
							</ListItem>
						</List>
					</Collapse>
					{/* first drop down */}
					<ListItemButton onClick={() => setMessageOpen(!messageOpen)}>
						<ListItemIcon>
							<MessageIcon />
						</ListItemIcon>
						<ListItemText primary='Messages' />
						{messageOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={messageOpen} timeout='auto' unmountOnExit>
						<List component='div' style={{ maxHeight: 150, overflow: 'auto' }} disablePadding>
							<ListItem alignItems='flex-start'>
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'>
												Ali Connors
											</Typography>
											{" — I'll be in your neighborhood doing errands this…"}
										</>
									}
								/>
							</ListItem>
							<ListItem alignItems='flex-start'>
								<ListItemText
									secondary={
										<>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'>
												Ali Connors
											</Typography>
											{" — I'll be in your neighborhood doing errands this…"}
										</>
									}
								/>
							</ListItem>
						</List>
					</Collapse>
					<Toolbar />
					<ListItem onClick={() => dispatch({ type: 'LOGOUT' })} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary='Log Out' />
						</ListItemButton>
					</ListItem>
				</List>
				<Divider />
			</Drawer>
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
										<span className='underlineName' onClick={() => privateMessage(message.user_id)}>
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
