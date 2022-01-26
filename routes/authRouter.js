// the router file contains all the routes that can be accessed
const authController = require('../controllers/authController.js')
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/validate', passport.authenticate('local', { failureRedirect: '/' }),
function(req, res) {
    res.json({
        message: "validated"
    });
});

router.post('/', authController.authenticateUser);

router.get('/data', authController.isLoggedIn, authController.getData);

router.get('/logout', authController.logout);

module.exports = router