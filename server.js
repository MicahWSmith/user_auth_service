const express =  require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('trust proxy', 1);
app.use(session({
  secret: 'ssshhhhh',
  resave: false,
  saveUninitialized: false,
  maxAge: 300000
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
