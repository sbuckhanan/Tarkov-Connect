const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// This route is used to get all of a users friends
router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		const queryText =
			'SELECT user_friends.friend_id, "user".tarkov_name FROM user_friends JOIN "user" ON "user".id = user_friends.friend_id WHERE user_friends.user_id = $1;';
		pool
			.query(queryText, [req.user.id])
			.then((result) => {
				res.send(result.rows);
			})
			.catch((error) => {
				console.log(error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This route is used to get all the friend requests a specific user has received
router.get('/requests', (req, res) => {
	console.log('HERE IS USER', req.user.id);
	if (req.isAuthenticated()) {
		const queryText =
			'SELECT friend_requests.id, friend_requests.sender_user_id, "user".tarkov_name FROM friend_requests JOIN "user" ON "user".id = friend_requests.sender_user_id WHERE receiver_user_id = $1;';
		pool
			.query(queryText, [req.user.id])
			.then((result) => {
				console.log('HERE ARE YOUR FRIEND REQUESTS', result.rows);
				res.send(result.rows);
			})
			.catch((error) => {
				console.log(error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This route checks if two users are friends. If they are it will return something. If not it will return nothing
router.get('/areFriends/:id', (req, res) => {
	const id = req.params.id;
	if (req.isAuthenticated()) {
		const queryText = 'SELECT * FROM user_friends WHERE user_id = $1 AND friend_id = $2;';
		pool
			.query(queryText, [req.user.id, id])
			.then((result) => {
				res.send(result.rows[0]);
			})
			.catch((error) => {
				console.log(error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This will post a new friend request made by a user
router.post('/', (req, res) => {
	const { receiverId } = req.body;
	if (req.isAuthenticated()) {
		const queryText =
			'INSERT INTO friend_requests (receiver_user_id, sender_user_id) VALUES ($1, $2);';
		pool
			.query(queryText, [receiverId, req.user.id])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error Posting new friend request', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This will delete a friend request
router.delete('/requests/:id', (req, res) => {
	const id = req.params.id;
	if (req.isAuthenticated()) {
		const queryText = 'DELETE FROM friend_requests WHERE id = $1;';
		pool
			.query(queryText, [id])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error deleting friend request', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This will post new friend for both users
router.post('/accept', (req, res) => {
	const { friendId } = req.body;
	if (req.isAuthenticated()) {
		const queryText = 'INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2);';
		pool.query(queryText, [friendId, req.user.id]);
		pool
			.query(queryText, [req.user.id, friendId])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error Posting new friend', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This will delete a friend request if it is denied by the receiver
router.delete('/decline/:id', (req, res) => {
	if (req.isAuthenticated()) {
		const id = req.params.id;
		const queryText =
			'DELETE FROM friend_requests WHERE sender_user_id = $2 AND receiver_user_id = $1;';
		pool
			.query(queryText, [req.user.id, id])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error declining friend request', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

//? This will delete someone as a friend for both users
router.delete('/delete/:id', (req, res) => {
	if (req.isAuthenticated()) {
		const id = req.params.id;
		const queryText = 'DELETE FROM user_friends WHERE user_id = $1 AND friend_id = $2;';
		pool.query(queryText, [id, req.user.id]);
		pool
			.query(queryText, [req.user.id, id])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error deleting friend', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;
