import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
//? MUI COMPONENTS
import {
	Box,
	Toolbar,
	List,
	Tabs,
	Tab,
	Typography,
	Paper,
	InputBase,
	Divider,
	IconButton,
	Chip,
} from '@mui/material';
//? Sweet alerts
import Swal from 'sweetalert2';
//? ICONS
import PropTypes from 'prop-types';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

import './Profile.css';

const min = 0;
const max = 10;

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography component={'span'}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function Profile() {
	const messagesEndRef = useRef(null);
	const profile = useSelector((store) => store.profile);
	const user = useSelector((store) => store.user);
	const dispatch = useDispatch();
	const history = useHistory();
	const [value, setValue] = useState(0);
	const [rating, setRating] = useState('');
	const [comment, setComment] = useState('');
	const [editName, setEditName] = useState('');
	const [editLevel, setEditLevel] = useState('');
	const [editingFeedback, setEditingFeedback] = useState(false);
	const [feedbackId, setFeedbackId] = useState(0);
	const { username } = useParams();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const addFeedback = () => {
		dispatch({
			type: 'ADD_FEEDBACK',
			payload: {
				rating,
				comment,
				receiverName: profile.user_info.tarkov_name,
				receiver: profile.user_info.id,
			},
		});
		setValue(0);
		setRating(0);
		setComment('');
	};

	const privateMessage = (id) => {
		dispatch({ type: 'SET_RECEIVER_ID', payload: id });
		history.push(`/private/${profile.user_info.tarkov_name}`);
	};

	const handleEdit = () => {
		setEditName(profile.user_info.tarkov_name);
		setEditLevel(profile.user_info.tarkov_level);
	};

	const submitEdit = () => {
		dispatch({ type: 'UPDATE_USER', payload: { name: editName, level: editLevel } });
		setEditName('');
		setEditLevel('');
		setValue(0);
	};

	const startEditingFeedback = (feedback) => {
		setEditingFeedback(!editingFeedback);
		setRating(feedback.rating);
		setComment(feedback.comment);
		setFeedbackId(feedback.id);
		setValue(1);
		//? Maybe figure out how to go to the other tab?
	};

	const cancelEdit = () => {
		setEditingFeedback(!editingFeedback);
		setRating(0);
		setComment('');
		setFeedbackId(0);
		setValue(0);
	};

	const submitEditedFeedback = () => {
		dispatch({
			type: 'EDIT_FEEDBACK',
			payload: { rating, comment, feedbackId, currentProfile: profile.user_info.tarkov_name },
		});
		setEditingFeedback(!editingFeedback);
		setRating(0);
		setComment('');
		setFeedbackId(0);
		setValue(0);
		//? Maybe figure out how to go back to the other tab?
	};

	const deleteFeedback = (feedback) => {
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
				dispatch({
					type: 'DELETE_FEEDBACK',
					payload: { id: feedback.id, currentProfile: profile.user_info.tarkov_name },
				});
				Swal.fire('Deleted!', 'Your feedback has been deleted.', 'success');
			}
		});
	};

	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_PROFILE', payload: username });
		//? this is what server sends
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<SideBar />
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<div className='profileContainer'>
					<header>
						{profile.user_info?.tarkov_name}
						<span>
							<PersonAddIcon />
						</span>
						<span>
							<ChatIcon onClick={() => privateMessage(profile.user_info?.id)} />
						</span>
					</header>
					<ul>
						<li>
							{' '}
							Rating:{' '}
							{profile.user_info?.rating < 5 && profile.user_info?.rating !== null ? (
								<span className='red'>{profile.user_info?.rating}</span>
							) : profile.user_info?.rating >= 5 &&
							  profile.user_info?.rating < 8 &&
							  profile.user_info?.rating !== null ? (
								<span className='yellow'>{profile.user_info?.rating}</span>
							) : profile.user_info?.rating >= 8 && profile.user_info?.rating !== null ? (
								<span className='green'>{profile.user_info?.rating}</span>
							) : profile.user_info?.rating == null ? (
								<span className='yellow'>5</span>
							) : (
								''
							)}
						</li>
						<li>Level: {profile.user_info?.tarkov_level}</li>
					</ul>
				</div>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange}>
						<Tab sx={{ color: 'white' }} label='Feedback' {...a11yProps(0)} />
						{user.id === profile.user_info?.id ? (
							<Tab
								sx={{ color: 'white' }}
								label='Edit Account'
								{...a11yProps(1)}
								onClick={handleEdit}
							/>
						) : (
							<Tab sx={{ color: 'white' }} label='Add Feedback' {...a11yProps(1)} />
						)}
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<List id='messageScroll' style={{ maxHeight: 200, overflow: 'auto' }}>
						{profile.feedback?.map((item) => {
							return (
								<div className='messageCard' key={item.id}>
									{item?.sender_user_id === user.id ? (
										<>
											<h3 className='messageName'>
												<span className='underlineName'>{item?.tarkov_name}</span>
												<span className='messageTime'> {item?.time}</span>
											</h3>
											<p className='messageDesc'>{item?.comment}</p>
											<p>
												<span className='editSpan' onClick={() => startEditingFeedback(item)}>
													Edit
												</span>
												<span className='deleteSpan' onClick={() => deleteFeedback(item)}>
													Delete
												</span>
											</p>
										</>
									) : (
										<>
											<h3 className='messageName'>
												<span className='underlineName'>{item?.tarkov_name}</span>
												<span className='messageTime'> {item?.time}</span>
											</h3>
											<p className='messageDesc'>{item?.comment}</p>
										</>
									)}
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</List>
				</TabPanel>
				{user.id === profile.user_info?.id ? (
					<TabPanel value={value} index={1}>
						<h3 className='editingHeader'>EDITING ACCOUNT</h3>
						<Paper
							component='form'
							sx={{
								p: '2px 4px',
								display: 'inline',
								alignItems: 'center',
								width: 250,
								height: 200,
							}}>
							<InputBase
								onChange={(e) => setEditName(e.target.value)}
								value={editName}
								sx={{ ml: 1, flex: 1 }}
								placeholder='Message....'
							/>
						</Paper>
						<Paper
							component='form'
							sx={{ p: '2px 4px', display: 'inline', alignItems: 'center', width: 50, ml: 3 }}>
							<InputBase
								onChange={(e) => setEditLevel(e.target.value)}
								value={editLevel}
								sx={{ ml: 1, flex: 1, width: 100 }}
								placeholder='0'
								type='number'
								inputProps={{ min }}
							/>
							<Divider sx={{ height: 28, m: 0.5, display: 'inline' }} orientation='vertical' />
							<Chip onClick={submitEdit} icon={<SendIcon />} label='Submit' />
						</Paper>
					</TabPanel>
				) : (
					<TabPanel value={value} index={1}>
						<Paper component='form' sx={{ p: '2px 4px', display: 'inline', alignItems: 'center' }}>
							<InputBase
								value={rating}
								sx={{ ml: 1, flex: 1, width: 100 }}
								placeholder='0'
								type='number'
								inputProps={{ min, max }}
								onChange={(e) => setRating(e.target.value)}
							/>
						</Paper>
						<Paper
							component='form'
							sx={{
								p: '2px 4px',
								display: 'inline',
								alignItems: 'center',
								width: 250,
								height: 200,
								ml: 3,
							}}>
							<InputBase
								onChange={(e) => setComment(e.target.value)}
								value={comment}
								sx={{ ml: 1, flex: 1 }}
								placeholder='Comment....'
							/>
							{editingFeedback ? (
								<>
									<Chip onClick={submitEditedFeedback} icon={<SendIcon />} label='Submit Edit' />
									<Divider sx={{ height: 28, m: 0.5, display: 'inline' }} orientation='vertical' />
									<IconButton onClick={cancelEdit} color='primary' sx={{ p: '10px' }}>
										<CloseIcon />
									</IconButton>
								</>
							) : (
								<Chip onClick={addFeedback} icon={<SendIcon />} label='Submit' />
							)}
						</Paper>
					</TabPanel>
				)}
			</Box>
		</Box>
	);
}

export default Profile;
