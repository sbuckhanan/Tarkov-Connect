import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { useHistory } from 'react-router-dom';

const drawerWidth = 280;

function SideBar() {
	const [messageOpen, setMessageOpen] = useState(false);
	const [friendOpen, setFriendOpen] = useState(false);
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const history = useHistory();

	return (
		<>
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
					<ListItem onClick={() => history.push('/global')} disablePadding>
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
		</>
	);
}

export default SideBar;
