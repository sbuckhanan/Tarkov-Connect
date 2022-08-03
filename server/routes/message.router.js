const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const moment = require('moment');

// This route should return all of the messages
router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		let queryText = `SELECT messages.id, messages.description, messages.time, messages.user_id, "user".tarkov_name FROM "messages" JOIN "user" ON "user".id = messages.user_id;`;
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
				console.log('Error Posting new pet', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

router.get('/privateMessage', (req, res) => {
	if (req.isAuthenticated()) {
		let queryText = `SELECT private_messages.id, private_messages.message, private_messages.time, private_messages.user_id, user_private_messages.sender_user_id, user_private_messages.receiver_user_id, "user".username  FROM private_messages JOIN user_private_messages ON private_messages.id = user_private_messages.message_id JOIN "user" ON "user".id = user_private_messages.sender_user_id;`;
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
				console.log('Error Posting new pet', error);
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(403);
	}
});

module.exports = router;

// POST a new order
// router.post('/', async (req, res) => {
// 	const client = await pool.connect();

// 	try {
// 		const { customer_name, street_address, city, zip, type, total, pizzas } = req.body;
// 		const orderInsertResults = await pool.query(
// 			`INSERT INTO "orders" ("customer_name", "street_address", "city", "zip", "type", "total")
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING id;`,
// 			[customer_name, street_address, city, zip, type, total]
// 		);
// 		const orderId = orderInsertResults.rows[0].id;

// 		await Promise.all(
// 			pizzas.map((pizza) => {
// 				const insertLineItemText = `INSERT INTO "line_item" ("order_id", "pizza_id", "quantity") VALUES ($1, $2, $3)`;
// 				const insertLineItemValues = [orderId, pizza.id, pizza.quantity];
// 				return client.query(insertLineItemText, insertLineItemValues);
// 			})
// 		);

// 		await client.query('COMMIT');
// 		res.sendStatus(201);
// 	} catch (error) {
// 		await client.query('ROLLBACK');
// 		console.log('Error POST /api/order', error);
// 		res.sendStatus(500);
// 	} finally {
// 		client.release();
// 	}
// });
