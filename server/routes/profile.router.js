const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const moment = require('moment');

// This route should return all of the messages
router.get('/feedback/:id', (req, res) => {
	const id = req.params.id;
	if (req.isAuthenticated()) {
		const queryText =
			'SELECT feedback.id, feedback.comment, feedback.time, "user".tarkov_name FROM "user" JOIN "feedback" ON feedback.sender_user_id = "user".id WHERE feedback.receiver_user_id = $1 GROUP BY feedback.id, "user".tarkov_name;';
		pool
			.query(queryText, [id])
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

router.get('/info/:id', (req, res) => {
	const id = req.params.id;
	if (req.isAuthenticated()) {
		const queryText =
			'SELECT "user".id, "user".tarkov_name, "user".tarkov_level, round(avg(rating), 2) AS rating FROM feedback JOIN "user" ON "user".id = feedback.receiver_user_id WHERE receiver_user_id = $1 GROUP BY "user".tarkov_name, "user".tarkov_level, "user".id;';
		pool
			.query(queryText, [id])
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

//? This will post a new message
router.post('/feedback', (req, res) => {
	const timePosted = moment().format('LLL');
	const { rating, comment, receiver } = req.body;
	console.log('THIS IS THE USER', req.user);
	if (req.isAuthenticated()) {
		let queryText = `INSERT INTO feedback (rating, comment, time, sender_user_id, receiver_user_id) VALUES ($1, $2, $3, $4, $5);`;
		pool
			.query(queryText, [rating, comment, timePosted, req.user.id, receiver])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error Posting new pet', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;
