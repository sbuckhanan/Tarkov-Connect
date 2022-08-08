import { Typography, ListItem, ListItemText } from '@mui/material';

function FriendItem({ friend }) {
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
}

export default FriendItem;
