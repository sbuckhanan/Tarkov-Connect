import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
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
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

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

	const goToProfile = () => {
		dispatch({ type: 'GET_PROFILE', payload: user.tarkov_name });
		history.push(`/profile/${user.tarkov_name}`);
	};

	const privateMessage = (id) => {
		dispatch({ type: 'GET_PROFILE', payload: id.tarkov_name });
		history.push(`/private/${id.tarkov_name}`);
	};

	const markAsRead = (notificationId) => {
		dispatch({ type: 'MARK_AS_READ', payload: notificationId });
	};

	useEffect(() => {
		dispatch({ type: 'ALL_MESSAGES' });
	}, [dispatch]);

	return (
		<>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
				<Toolbar className='topBar'>
					<Typography variant='h6' noWrap component='div'>
						Tarkov Connects
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
				<span onClick={goToProfile}>{user.tarkov_name}</span>
				<Divider />
				<List>
					<ListItemButton onClick={() => setNotificationOpen(!notificationOpen)}>
						<span className='notifications'>Notifications</span>{' '}
						<Badge color='secondary' badgeContent={totalNotifications}>
							<MailIcon />
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
							{messages.map((message) => {
								return (
									<div key={message.message_id}>
										<ListItem alignItems='flex-start'>
											<ListItemText
												secondary={
													<>
														<Typography
															onClick={() => privateMessage(message)}
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
