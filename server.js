const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const server = require('http').createServer(app);
const io = require('socket.io');

global.socketIo = io(server);

connectDB();

// Express Initializations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/drugs', require('./routes/drugRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

global.socketIo.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`drugstore app listening on port ${port}`);
});