// the router file contains all the routes that can be accessed
const userController = require('../controllers/userController.js')

// create a Router object from express
const router = require('express').Router()

// add a new user to the table
router.post('/', userController.addUser)

// get user and associated profile
router.get('/:id', userController.getUser);

// modify one user by id
router.put('/:id', userController.updateUser)

// delete one user by id
router.delete('/:id', userController.deleteUser)

module.exports = router