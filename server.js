const express =  require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const readurl = require("url");
const RedisStore = require("connect-redis")(session);

require("dotenv").config();

if(process.env.REDIS_URL){
  var heredis = readurl.parse(process.env.REDIS_URL);

  var redis = require('redis').createClient({ port: heredis.port, hostname: heredis.hostname });

  redis.auth(heredis.auth.split(':')[1]);

  redis.on('error', (e) => {
    console.log(e);
  })
}
else{
  var redis = require('redis').createClient();
}

const app = express();

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(session({
  store: new RedisStore({
    client: redis
  }),
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
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
