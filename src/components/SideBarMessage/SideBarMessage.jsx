import { Typography, Divider, ListItem, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function SideBarMessage({ message }) {
	const dispatch = useDispatch();
	const history = useHistory();

	const privateMessage = () => {
		dispatch({ type: 'GET_PROFILE', payload: message.tarkov_name });
		history.push(`/private/${message.tarkov_name}`);
	};

	return (
		<div key={message.message_id}>
			<ListItem alignItems='flex-start'>
				<ListItemText
					onClick={privateMessage}
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
}

export default SideBarMessage;
