import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import './Profile.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import Swal from 'sweetalert2';

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
		console.log('ADDING FEEDBACK');
		dispatch({
			type: 'ADD_FEEDBACK',
			payload: { rating, comment, receiver: profile.user_info.tarkov_name },
		});
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
				history.push('/');
			}
		});
	};

	useEffect(() => {
		//? this gets messages from the db on page load
		dispatch({ type: 'GET_PROFILE', payload: username });
		//? this is what server sends
	}, [dispatch]);

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
					<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
						<Tab label='Feedback' {...a11yProps(0)} />
						{user.id === profile.user_info?.id ? (
							<Tab label='Edit Account' {...a11yProps(1)} onClick={handleEdit} />
						) : (
							<Tab label='Add Feedback' {...a11yProps(1)} />
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
						<h3>EDITING ACCOUNT</h3>
						<label htmlFor='tarkovName'>Tarkov Name</label>
						<input
							value={editName}
							name='tarkovName'
							type='text'
							placeholder='0'
							onChange={(e) => setEditName(e.target.value)}
						/>
						<label htmlFor='tarkovLevel'>Tarkov Level</label>
						<input
							value={editLevel}
							name='tarkovLevel'
							type='number'
							placeholder='Comment...'
							onChange={(e) => setEditLevel(e.target.value)}
						/>
						<button onClick={submitEdit}>Submit Edit</button>
					</TabPanel>
				) : (
					<TabPanel value={value} index={1}>
						<label htmlFor='rating'>Rating</label>
						<input
							value={rating}
							name='rating'
							type='number'
							placeholder='0'
							onChange={(e) => setRating(e.target.value)}
						/>
						<label htmlFor='comment'>Comment</label>
						<input
							value={comment}
							name='comment'
							type='text'
							placeholder='Comment...'
							onChange={(e) => setComment(e.target.value)}
						/>
						{editingFeedback ? (
							<button onClick={submitEditedFeedback}>Submit Edit</button>
						) : (
							<button onClick={addFeedback}>Submit</button>
						)}
					</TabPanel>
				)}
			</Box>
		</Box>
	);
}

export default Profile;
