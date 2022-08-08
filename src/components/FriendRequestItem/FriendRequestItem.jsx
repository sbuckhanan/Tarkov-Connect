import { Typography, ListItem, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';

function FriendRequestItem({ request }) {
	const dispatch = useDispatch();

	const acceptFriend = () => {
		dispatch({
			type: 'ACCEPT_FRIEND',
			payload: { id: request.id, friendId: request.sender_user_id },
		});
	};

	const declineFriend = () => {
		dispatch({ type: 'DECLINE_REQUEST', payload: { requester: request.sender_user_id } });
	};

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
							<span onClick={acceptFriend} className='acceptButton'>
								Accept
							</span>{' '}
							<span onClick={declineFriend} className='declineButton'>
								Decline
							</span>
						</Typography>
					</>
				}
			/>
		</ListItem>
	);
}

export default FriendRequestItem;
