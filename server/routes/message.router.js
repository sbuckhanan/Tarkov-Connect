const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const moment = require('moment');

// This route should return all of the messages
router.get('/all', (req, res) => {
	if (req.isAuthenticated()) {
		let queryText = `SELECT DISTINCT ON ("user".tarkov_name) user_private_messages.message_id, private_messages.message, private_messages.time, private_messages.user_id, user_private_messages.sender_user_id, user_private_messages.receiver_user_id, "user".tarkov_name  FROM private_messages JOIN user_private_messages ON private_messages.id = user_private_messages.message_id JOIN "user" ON "user".id = user_private_messages.sender_user_id WHERE user_private_messages.receiver_user_id = $1 ORDER BY "user".tarkov_name, user_private_messages.message_id DESC;`;
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

// This route should return all of the messages
router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		let queryText = `SELECT messages.id, messages.description, messages.time, messages.user_id, "user".tarkov_name, "user"."socketId" FROM "messages" JOIN "user" ON "user".id = messages.user_id;`;
		pool
			.query(queryText)
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

//? This will post a new message
router.post('/', (req, res) => {
	const timePosted = moment().format('LLL');
	console.log('THIS IS THE USER', req.user);
	if (req.isAuthenticated()) {
		let queryText = `INSERT INTO messages (description, time, user_id) VALUES ($1, $2, $3);`;
		pool
			.query(queryText, [req.body.message, timePosted, req.user.id])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error Posting new message', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

router.get('/privateMessage/:id', (req, res) => {
	if (req.isAuthenticated()) {
		const id = req.params.id;
		let queryText = `SELECT private_messages.id, private_messages.message, private_messages.time, private_messages.user_id, user_private_messages.sender_user_id, user_private_messages.receiver_user_id, "user".tarkov_name, "user"."socketId" FROM private_messages JOIN user_private_messages ON private_messages.id = user_private_messages.message_id JOIN "user" ON "user".id = user_private_messages.sender_user_id WHERE user_private_messages.receiver_user_id = $1 AND user_private_messages.sender_user_id = $2 OR user_private_messages.sender_user_id = $1 AND user_private_messages.receiver_user_id = $2;`;
		pool
			.query(queryText, [id, req.user.id])
			.then((result) => {
				res.send(result.rows);
			})
			.catch((error) => {
				console.log('Error getting a private messages', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

router.post('/privateMessage', async (req, res) => {
	const timePosted = moment().format('LLL');
	console.log('HERE IS YOUR PRIVATE MESSAGE POST', req.body);
	if (req.isAuthenticated()) {
		const queryText =
			'INSERT INTO private_messages (message, time, user_id) VALUES ($1, $2, $3) RETURNING id;';
		const messageResults = await pool.query(queryText, [req.body.message, timePosted, req.user.id]);
		const messageId = messageResults.rows[0].id;
		let junctionText = `INSERT INTO user_private_messages (message_id, sender_user_id, receiver_user_id) VALUES ($1, $2, $3);`;
		await pool
			.query(junctionText, [messageId, req.user.id, req.body.receiverId])
			.then((result) => {
				res.sendStatus(200);
			})
			.catch((error) => {
				console.log('Error posting new Private Message', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

router.put('/:id', (req, res) => {
	const id = req.params.id;
	const { message } = req.body;
	if (req.isAuthenticated()) {
		let queryText = `UPDATE messages SET description = $2 WHERE id = $1;`;
		pool
			.query(queryText, [id, message])
			.then((result) => {
				res.sendStatus(201);
			})
			.catch((error) => {
				console.log('ERROR DELETING', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

router.delete('/:id', (req, res) => {
	const id = req.params.id;
	if (req.isAuthenticated()) {
		let queryText = `DELETE FROM messages WHERE id = $1;`;
		pool
			.query(queryText, [id])
			.then((result) => {
				res.sendStatus(201);
			})
			.catch((error) => {
				console.log('ERROR DELETING', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;
