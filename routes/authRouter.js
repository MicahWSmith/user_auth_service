// the router file contains all the routes that can be accessed
const authController = require('../controllers/authController.js')

// create a Router object from express
const router = require('express').Router()

// authenticate user and send token / authenticate token
router.post('/', authController.authenticateUser);

router.get('/data', authController.isLoggedIn, authController.getData);

router.get('/logout', authController.logout);

module.exports = router