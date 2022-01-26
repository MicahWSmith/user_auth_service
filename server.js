const express =  require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const readurl = require("url");

require("dotenv").config();

const app = express();

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 300000,
    sameSite: true,
    secure: true
  }
}));

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
