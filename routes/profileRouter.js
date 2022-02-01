// the router file contains all the routes that can be accessed
const profileController = require('../controllers/profileController.js')

// create a Router object from express
const router = require('express').Router()

// add a new profile to the table
router.post('/', profileController.addProfile)

// get profile
router.post('/get', profileController.getProfile);

// modify one profile by id
router.post('/update', profileController.updateProfile)

// delete one profile by id
router.post('/delete', profileController.deleteProfile)

module.exports = router