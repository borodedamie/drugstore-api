const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const server = require('http').createServer(app);
const io = require('socket.io');
// const admin = require('firebase-admin');
// const serviceAccount = require('./utils/drugstore-geolocation-app-firebase-adminsdk-7wv0k-6870466546.json')
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oidc').Strategy;
const User = require('./models/userModel');
const { swaggerDocs } = require('./utils/swagger');
const cors = require('cors');
const { checkAndCreateFolder } = require('./utils/uploadsDirs');
const cookieParser = require('cookie-parser');

global.socketIo = io(server);
connectDB();
checkAndCreateFolder('drugs');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

var sess = {
  secret: process.env.EXPRESS_SESSION_SECRET_KEY,
  cookie: {}
}

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:5000/api/users/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, cb) {
  const user = {
    id: profile.id,
    profile: profile,
    accessToken: accessToken,
    refreshToken: refreshToken
  };
  return cb(null, user);
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/users/auth/google/callback"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Express Initializations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess))

app.use('/uploads', express.static('uploads'))

const allowedOrigins = ['http://localhost:8100', 'https://drugstore-geolocation-app.web.app', 'https://drugstore-geolocation-app.firebaseapp.com'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  // Access session data
  const { views } = req.session;
  req.session.views = views ? views + 1 : 1;

  res.send(`Number of views: ${req.session.views}`);
});

app.use('/users', require('./routes/userRoutes'));
app.use('/stores', require('./routes/storeRoutes'));
app.use('/drugs', require('./routes/drugRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/supports', require('./routes/supportRoutes'));
app.use('/carts', require('./routes/cartRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));

global.socketIo.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`drugstore app listening on port ${port}`);

  swaggerDocs(app, port);
});