import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import socket from '../../socket/socket';
import './GlobalChat.css';

//? Testing
import * as React from 'react';
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

	const handleClick = () => {
		setOpen(!open);
	};

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
					<ListItem disablePadding>
						{/* <ListItemButton>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary='Friends' />
						</ListItemButton> */}
					</ListItem>
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
										<React.Fragment>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'>
												Ali Connors
											</Typography>
											{" — I'll be in your neighborhood doing errands this…"}
										</React.Fragment>
									}
								/>
							</ListItem>
							<ListItem alignItems='flex-start'>
								<ListItemText
									secondary={
										<React.Fragment>
											<Typography
												sx={{ display: 'inline' }}
												component='span'
												variant='body2'
												color='text.primary'>
												Ali Connors
											</Typography>
											{" — I'll be in your neighborhood doing errands this…"}
										</React.Fragment>
									}
								/>
							</ListItem>
						</List>
					</Collapse>
					<Toolbar />
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemIcon>{<MessageIcon />}</ListItemIcon>
							<ListItemText primary='Sign Out' />
						</ListItemButton>
					</ListItem>
				</List>
				<Divider />
			</Drawer>
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<List style={{ maxHeight: 550, overflow: 'auto' }}>
					{messages.map((message) => (
						<div className='messageCard' key={message.id}>
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
				</List>
				<center>
					<input type='text' name='' id='' />
					<button>Click Me</button>
				</center>
			</Box>
		</Box>
	);
}

export default GlobalChat;
