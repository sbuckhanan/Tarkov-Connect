import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
	Drawer,
	CssBaseline,
	AppBar,
	Typography,
	Divider,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Collapse,
	Toolbar,
	List,
	Badge,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useStyles from '../../hooks/useStyle';

const drawerWidth = 280;

function SideBar() {
	const [messageOpen, setMessageOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [friendOpen, setFriendOpen] = useState(false);
	const user = useSelector((store) => store.user);
	const messages = useSelector((store) => store.allMessages);
	const totalNotifications = useSelector((store) => store.totalNotifications);
	const notifications = useSelector((store) => store.notificationReducer);
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();
	const friendRequests = useSelector((store) => store.friendRequests);
	const myFriends = useSelector((store) => store.myFriends);

	const goToProfile = () => {
		dispatch({ type: 'GET_PROFILE', payload: user.tarkov_name });
		history.push(`/profile/${user.tarkov_name}`);
	};

	const goToMessage = (message) => {
		dispatch({ type: 'GET_PROFILE', payload: message.from });
		history.push(`/private/${message.from}`);
	};

	const privateMessage = (player) => {
		dispatch({ type: 'GET_PROFILE', payload: player.tarkov_name });
		history.push(`/private/${player.tarkov_name}`);
	};

	const markAsRead = (notificationId) => {
		dispatch({ type: 'MARK_AS_READ', payload: notificationId });
	};

	const acceptFriend = (request) => {
		dispatch({
			type: 'ACCEPT_FRIEND',
			payload: { id: request.id, friendId: request.sender_user_id },
		});
	};

	const declineFriend = (request) => {
		dispatch({ type: 'DECLINE_REQUEST', payload: { requester: request.sender_user_id } });
	};

	useEffect(() => {
		dispatch({ type: 'ALL_MESSAGES' });
		dispatch({ type: 'GET_NOTIFICATIONS' });
		dispatch({ type: 'GET_FRIEND_REQUESTS' });
		dispatch({ type: 'GET_FRIENDS' });
	}, []);

	return (
		<>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
				<Toolbar className='topBar'>
					<Typography variant='h6' noWrap component='div'>
						Tarkov Connect
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				classes={{ paper: classes.paper }}
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
					background: '#aba486',
				}}
				variant='permanent'
				anchor='left'
				className='SideBarContainer'>
				<Toolbar />
				<span onClick={goToProfile}>{user.tarkov_name}</span>
				<Divider />
				<List>
					<ListItemButton onClick={() => setNotificationOpen(!notificationOpen)}>
						<span className='notifications'>Notifications</span>{' '}
						<Badge color='primary' badgeContent={totalNotifications}>
							<NotificationsIcon />
						</Badge>
						{notificationOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					<Collapse in={notificationOpen} timeout='auto' unmountOnExit>
						<List component='div' style={{ maxHeight: 150, overflow: 'auto' }} disablePadding>
							{notifications.map((notification) => {
								return (
									<div key={notification.id}>
										<ListItem alignItems='flex-start'>
											<ListItemText
												secondary={
													<>
														<Typography
															sx={{ display: 'inline' }}
															component='span'
															variant='body2'
															color='text.primary'>
															NEW MESSAGE <br />
															{notification.from}{' '}
														</Typography>
														{notification.time}
														<br />
														{notification.message}
														<br />
														<span
															className='markAsRead'
															onClick={() => markAsRead(notification.id)}>
															Mark as read
														</span>
													</>
												}
											/>
										</ListItem>
										<Divider />
									</div>
								);
							})}
						</List>
					</Collapse>
					<Toolbar />
					<ListItem onClick={() => history.push('/global')} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								<HomeIcon />
							</ListItemIcon>
							<ListItemText primary='Home' />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton onClick={() => setFriendOpen(!friendOpen)}>
							<ListItemIcon>
								<PeopleIcon />
							</ListItemIcon>
							<ListItemText primary='Friends' />
							{friendOpen ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
					</ListItem>
					<Collapse in={friendOpen} timeout='auto' unmountOnExit>
						<List component='div' style={{ maxHeight: 150, overflow: 'auto' }} disablePadding>
							{friendRequests.map((request) => {
								return (
									<ListItem alignItems='flex-start'>
										<ListItemText
											secondary={
												<>
													<span className='requestHeader'> New Friend Request</span>
													<Typography
														sx={{ display: 'inline' }}
														component='span'
														variant='body2'
														color='text.primary'>
														<br />
														{request.tarkov_name} <br />
														<span onClick={() => acceptFriend(request)} className='acceptButton'>
															Accept
														</span>{' '}
														<span onClick={() => declineFriend(request)} className='declineButton'>
															Decline
														</span>
													</Typography>
												</>
											}
										/>
									</ListItem>
								);
							})}
							{myFriends.map((friend) => {
								return (
									<ListItem alignItems='flex-start'>
										<ListItemText
											secondary={
												<>
													<Typography
														sx={{ display: 'inline' }}
														component='span'
														variant='body2'
														color='text.primary'>
														{friend.tarkov_name}
													</Typography>
												</>
											}
										/>
									</ListItem>
								);
							})}
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
							{messages.map((message) => {
								return (
									<div key={message.message_id}>
										<ListItem alignItems='flex-start'>
											<ListItemText
												onClick={() => privateMessage(message)}
												secondary={
													<>
														<Typography
															sx={{ display: 'inline' }}
															component='span'
															variant='body2'
															color='text.primary'>
															{message.tarkov_name}{' '}
														</Typography>
														{message.time}
														<br />
														{message.message}
													</>
												}
											/>
										</ListItem>
										<Divider />
									</div>
								);
							})}
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
		</>
	);
}

export default SideBar;
