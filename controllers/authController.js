// require the db created in the index file
const db = require('../models/index');

const jwt = require('jsonwebtoken');
const dotenv = require ('dotenv');
dotenv.config();

// password security crypto methods
const cryptoController = require('./cryptoController');

// get the Users model
const User = db.Users

const logout = (req, res) => {
    // TODO somehow get rid of JWT
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
        const token = req.body.token;
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
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

function generateToken(param){
    return jwt.sign(param, process.env.TOKEN_SECRET, { expiresIn: '300s'});
}

// export all the controller functions
module.exports = {
    getLoginToken,
    getTokenData,
    logout,
}