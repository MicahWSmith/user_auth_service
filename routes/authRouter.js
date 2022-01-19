// the router file contains all the routes that can be accessed
const authController = require('../controllers/authController.js')

// create a Router object from express
const router = require('express').Router()

// add a new user to the table
router.post('/', authController.addUser)

// get user and associated profile
router.get('/:id', authController.getUser);

// modify one user by id
router.put('/:id', authController.updateUser)

// delete one user by id
router.delete('/:id', authController.deleteUser)

// authenticate user and send token / authenticate token
router.post('/:type', authController.authenticateUser);

module.exports = router