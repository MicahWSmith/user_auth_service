// require the db created in the index file
const db = require('../models/index')

const axios = require('axios');
// get the Users/profile model
const User = db.Users
const Profile = db.Profiles

const auth = require('./authController');

// password security crypto methods
const cryptoController = require('./cryptoController');
const { Profiles } = require('../models/index');

const randomString = function(len){
    const charSet = '0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
       let randomPoz = Math.floor(Math.random() * charSet.length);
       randomString += charSet.substring(randomPoz,randomPoz+1);
    };
    return randomString;
}

const addUser = async (req, res) => {
    try {
        // generate salt and hashed password for user
        const userPassData = cryptoController.saltHashPassword(req.body.password);
        let input_data = {
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            phone: req.body.phone,
            password: userPassData.passwordHash,
            security_question: req.body.security_question,
            security_answer: req.body.security_answer,
            salt: userPassData.salt
         }
         // using the builtin 'create' function on User Model
         const newUser = await User.create(input_data);
         
         /// ADD NEW PROFILE FOR NEW USER ///

         acctNum = randomString(10);
         rtNum = randomString(9);

         const profile_data = {
            ssn: "",
            account_number: acctNum,
            routing_number: rtNum,
            street_address: "",
            city: "",
            state: "",
            userId: newUser.id,
         }
         // using the builtin 'create' function on Profile Model
         const newProfile = await Profile.create(profile_data);

         /// CALL EXTERNAL APIS TO MAKE ACCOUNTS ///

         /// CASH ACCOUNT ///
        const acctresponse = await axios.post('https://bankaccountmicroservice.herokuapp.com/accounts/', {
            "balance": 0,
            "accountNumber": acctNum,
            "routingNumber": rtNum,
            "userId": newUser.id
        })
         .then(response => response.data)
        //  .catch((error) => {
        //     res.status(400).json({ error: error});
        //  })

         /// PORTFOLIO ///
        const portresponse = await axios.post('https://tp-portfolio-server.herokuapp.com/positions/', {
            userId: newUser.id
        })
         .then(prtresponse => prtresponse.data)
         /*.catch((error) => {
            res.status(400).json({ error: error});
         })*/

        res.status(200).json({ message: "account added" });
      } 
      catch (error) {
        res.status(400).json({ error: error});
      }
}

const getUser = async (req, res) => {
    try{
        let id = auth.decryptToken(req.body.token).id;
        console.log(id);
        let foundUser = await User.findOne({where: {id: id}, include: db.Profiles});
        res.status(200).send(foundUser);

    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}


const updateUser = async (req, res) => {
    try{
        let id = auth.decryptToken(req.body.token).id;
        const newData = {
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            phone: req.body.phone,
        }

        const updatedUser = await User.update(newData, { where: {id: id}});
        res.status(200).json({
            message: "user update success."
        });

    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}

const updateUserPassword = async (req, res) => {
    try{
        let id = auth.decryptToken(req.body.token).id;
        const newPassData = cryptoController.saltHashPassword(req.body.password);
        const newData = {
            password: newPassData.passwordHash,
            salt: newPassData.salt
        }

        const updatedUser = await User.update(newData, { where: {id: id}});
        res.status(200).json({
            message: "user password update success."
        });

    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}

const deleteUser = async (req, res) => {
    try{
        let id = auth.decryptToken(req.body.token).id;
    
        // using the builtin 'destroy' function on User Model
        await Profile.destroy({where :{userId: id}});
        await User.destroy({where :{id: id}});
        res.status(200).json({
            message: `User with id: ${id} is deleted`
        });
    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}

// export all the controller functions
module.exports = {
    addUser,
    getUser,
    updateUser,
    updateUserPassword,
    deleteUser
}