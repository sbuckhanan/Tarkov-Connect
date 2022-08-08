import { Typography, Divider, ListItem, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';

function NotificationItem({ notification }) {
	const dispatch = useDispatch();

	const markAsRead = () => {
		dispatch({ type: 'MARK_AS_READ', payload: notification.id });
	};

	return (
		<div>
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
							<span className='markAsRead' onClick={() => markAsRead(notification.id)}>
								Mark as read
							</span>
						</>
					}
				/>
			</ListItem>
			<Divider />
		</div>
	);
}

export default NotificationItem;
