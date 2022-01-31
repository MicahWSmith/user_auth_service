// the router file contains all the routes that can be accessed
const authController = require('../controllers/authController.js')
const express = require('express');
const router = express.Router();

router.post('/getToken', authController.getLoginToken );

router.post('/getTokenData', authController.getTokenData );

router.post('/getUserData', authController.getUserData );

router.post('/logout', authController.logout);

module.exports = router