const express =  require('express')
const app = express()

// process.env.PORT || 3000
const port = process.env.PORT || 3000;

// middlewares
app.use(express.urlencoded({ extended: true}));
app.use(express.json())

//routers
const authRoutes = require('./routes/authRouter.js');
app.use('/auth', authRoutes);

const profileRoutes = require('./routes/profileRouter.js');
app.use('/profiles', profileRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`User auth app listening at http://localhost:${port}`)
})
