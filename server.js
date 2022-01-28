const express =  require('express');
const cors = require('cors');

// require the db created in the index file
const db = require('./models/index');

// get the Users model
const User = db.Users

const app = express();

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

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
