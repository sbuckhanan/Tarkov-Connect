const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

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

router.get('/personId/:username', (req, res) => {
	const username = req.params.username;
	if (req.isAuthenticated()) {
		const queryText = 'SELECT "user".id FROM "user" WHERE "user".tarkov_name = $1;';
		pool
			.query(queryText, [username])
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

//? This will post a new friend request
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

//? This will post a new friend request
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

module.exports = router;
