const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const moment = require('moment');

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

router.get('/:id', (req, res) => {
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
			'INSERT INTO friend_requests (requester_user_id, sender_user_id) VALUES ($1, $2);';
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

module.exports = router;
