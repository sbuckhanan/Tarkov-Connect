import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import NotificationItem from '../NotificationItem/NotificationItem';
import FriendRequestItem from '../FriendRequestItem/FriendRequestItem';

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
import SideBarMessage from '../SideBarMessage/SideBarMessage';

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
								return <NotificationItem key={notification.id} notification={notification} />;
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
								return <FriendRequestItem key={request.id} request={request} />;
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
								return <SideBarMessage message={message} />;
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
