// the router file contains all the routes that can be accessed
const authController = require('../controllers/authController.js')
const express = require('express');
const router = express.Router();

router.post('/getToken', authController.getLoginToken );

// get users recovery info
router.post('/getRecoveryData', authController.getRecoveryData);

// login through recovery
router.post('/recoveryLogin', authController.recoveryLogin);

router.post('/getTokenData', authController.getTokenData );

router.post('/getUserData', authController.getUserData );

router.post('/logout', authController.logout);

module.exports = router