const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const server = require('http').createServer(app);
const io = require('socket.io');
const admin = require('firebase-admin');
const serviceAccount = require('./utils/drugstore-geolocation-app-firebase-adminsdk-7wv0k-6870466546.json')

global.socketIo = io(server);
connectDB();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Express Initializations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/drugs', require('./routes/drugRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/supports', require('./routes/supportRoutes'));

global.socketIo.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`drugstore app listening on port ${port}`);
});