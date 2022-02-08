// require the db created in the index file
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const dotenv = require ('dotenv');
const nodemailer = require("nodemailer");
dotenv.config();

let INVALID_TOKENS = [];
let RECOVERY_USERS = {};

// password security crypto methods
const cryptoController = require('./cryptoController');

// get the Users model
const User = db.Users

/// EMAIL CONFIG
const serviceEmail = process.env.EMAIL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: serviceEmail,
      pass: process.env.EMAIL_PASS
    }
  });

const logout = async (req, res) => {
    try{
        // get credentials from the request
        let token;
        if(req.body && req.body.token){ token = req.body.token; }
        // add users' token to list of invalid tokens for server to check
        INVALID_TOKENS.push(token);

        res.status(200).json({
            message: "user signed out successfully"
        });

    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

const getLoginToken = async (req, res) => {
    try{
        // getting vars from the params in the req
        const email = req.body.email;
        const password = req.body.password;
    
        const authUser = await User.findOne({where: {email: email}});
        
        if(authUser){
            // use db stored salt to check if password is a match
            const salt = authUser.dataValues.salt
            const inputPassData = cryptoController.sha512(password, salt);

            // validate that the passwords match
            if(inputPassData.passwordHash === authUser.dataValues.password){ 
                // get desired user info and store in user data object
                const userData = {
                    id: authUser.dataValues.id,
                }
                // create token with user data encrypted
                const token = generateToken(userData);
    
                // set response data to include token
                const responseData = {
                    token: token
                }
                // send token back in response
                res.status(200).json(responseData);
            }
            else{
                res.status(400).json({
                    error: "please check username and or password is entered correctly"
                });
            }
        }
        else{
            res.status(400).json({
                error: "please check username and or password is entered correctly"
            });
        }
    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

const getTokenData = async (req, res) => {
    try{
        // get credentials from the request
        let token;
        if(req.body && req.body.token){ token = req.body.token; }
        const decode = decryptToken(token);
        if(token){
            res.json({
                data: decode
            });
        }
        else{
            res.json({
                data: 'invalid token'
            });
        }
    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

const getUserData = async (req, res) => {
    try{
        // get credentials from the request
        let token;
        if(req.body && req.body.token){ token = req.body.token; }
        const decode = decryptToken(token);
        if(decode){

            const authUser = await User.findOne({where: {id: decode.id}, include: db.Profiles});
            if(authUser){
                const userData = {
                    id: authUser.dataValues.id,
                    first: authUser.dataValues.first,
                    last: authUser.dataValues.last,
                    email: authUser.dataValues.email,
                    phone: authUser.dataValues.phone,
                    security_question: authUser.dataValues.security_question,
                    security_answer: authUser.dataValues.security_answer,
                    profile: authUser.dataValues.profile
                }
                res.status(200).json({
                    data: userData
                });
            }
            else{
                res.status(400).json({
                    error: `user not found with the id ${decode.id}`
                })
            }
        }
        else{
            res.json({
                data: 'invalid token'
            });
        }
    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

const getRecoveryData = async (req, res) => {
    try{
        // get credentials from the request
        const email = req.body.email;
        const authUser = await User.findOne({where: {email: email}});
            if(authUser && !RECOVERY_USERS[email]){
                const userData = {
                    email: authUser.dataValues.email,
                }
                const code = randomString(6);
                RECOVERY_USERS[email] = code;
                sendCode(email,code);
                // TODO: email code and set timeout for code 
                setTimeout(() => {delete RECOVERY_USERS[email]}, 60000);
                res.status(200).json({
                    data: userData
                });
            }
            else{
                res.status(400).json({
                    error: `user not found with the email ${email}`
                })
            }
    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

const recoveryLogin = async (req, res) => {
    try{
        // getting vars from the params in the req
        const email = req.body.email;
        const code = req.body.code;

        if(RECOVERY_USERS[email] && RECOVERY_USERS[email] == code){
            const authUser = await User.findOne({where: {email: email}});
            if(authUser){
                const userData = {
                    id: authUser.dataValues.id,
                }
                // create token with user data encrypted
                const token = generateToken(userData);
    
                // set response data to include token
                const responseData = {
                    token: token
                }
                // send token back in response
                res.status(200).json(responseData);
            }
            else{
                res.status(400).json({
                    error: "please check credentials"
                });
            }
        }
        else{
            res.status(400).json({
                error: "user has not requested recovery"
            });
        }
    } catch(error){
        res.status(400).json({
            error: error
        });
    }
}

function generateToken(param){
    return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '30m'});
}

function decryptToken(token){
    if(INVALID_TOKENS.indexOf(token) == -1){
        return jwt.verify(token, process.env.TOKEN_SECRET);
    }
}

const randomString = function(len){
    const charSet = '0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
       let randomPoz = Math.floor(Math.random() * charSet.length);
       randomString += charSet.substring(randomPoz,randomPoz+1);
    };
    return randomString;
}

const sendCode = function (userEmail, code){
    let mailOptions = {
        from: serviceEmail,
        to: userEmail,
        subject: 'Account recovery',
        html: `<h1>${code} is your account recovery pin</h1><hr>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

// export all the controller functions
module.exports = {
    getLoginToken,
    getTokenData,
    getUserData,
    logout,
    decryptToken,
    getRecoveryData,
    recoveryLogin,
    INVALID_TOKENS
}