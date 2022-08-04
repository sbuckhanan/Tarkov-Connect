const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

//! ALL OF THIS IS NEEDED FOR SOCKET. PLUS CHANGE LISTENER ON THE BOTTOM.
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});
//! This handles the connection event. All events inside works like query onReady.
io.on('connection', (socket) => {
	//? set socket.username to the username client sends after login
	console.log(`User Connected: With id: ${socket.id}`);
	//? If client sends us send message do stuff. Data is the object we sent over.
	socket.on('send_message', (data) => {
		console.log('HERE IS YOUR MESSAGE', data);
		//? io.emit sends something to everyone
		io.emit('receive_message', data);
		//? socket.broadcast.emit sends one to everyone but the sender.
	});
	socket.on('send_private_message', (data) => {
		// console.log('HERE IS YOUR MESSAGE', data);
		//? io.emit sends something to everyone
		io.emit('get_private_messages', data);
		socket.to(data.socketId).emit('private message', data);
		//? socket.broadcast.emit sends one to everyone but the sender.
	});
});
//! END OF SOCKET STUFF

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const messageRouter = require('./routes/message.router');
const profileRouter = require('./routes/profile.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/messages', messageRouter);
app.use('/api/profile', profileRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
server.listen(PORT, () => {
	console.log(`Listening on port: ${PORT}`);
});
