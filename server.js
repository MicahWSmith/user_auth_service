const express =  require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

// require the db created in the index file
const db = require('./models/index');

// get the Users model
const User = db.Users

require("dotenv").config();

const app = express();

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 300000
  }
}));

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(email, password, cb) {
  User.findOne({
    where: {email: email, password: password},
     include: db.Profiles, 
     raw : true
    }).then(function(user){
      if (!user) { return cb(null, false); }
      return cb(null, user);
  }).catch(function(error){
      if (error) { return cb(null, error); }
  });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.email);
});

passport.deserializeUser(function(username, cb) {
  User.findOne({
      where: {
          email: username
      },
      raw : true
  }).then(function(user) {
      cb(null, user.id);
  });
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

// routers //
const authRoutes = require('./routes/authRouter.js');
app.use('/auth', authRoutes);

const profileRoutes = require('./routes/profileRouter.js');
app.use('/profiles', profileRoutes);

const userRoutes = require('./routes/userRouter.js');
app.use('/users', userRoutes);

////

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`User auth app listening at http://localhost:${port}`)
})
