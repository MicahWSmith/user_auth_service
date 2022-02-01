// require the db created in the index file
const db = require('../models/index')

const axios = require('axios');
// get the Users model
const User = db.Users

const auth = require('./authController');

// password security crypto methods
const cryptoController = require('./cryptoController');

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

         // TODO: make call to external apis to establish new accounts
         /*axios.post('/todos', {
           todo: 'Buy the milk',
         })
         .then((res) => {
           console.log(`statusCode: ${res.statusCode}`)
           console.log(res)
         })
         .catch((error) => {
           console.error(error)
         })*/

         // send a 200 response with the created entry user
         res.status(200).json({
             message: "user add success"
         });
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
            security_question: req.body.security_question,
            security_answer: req.body.security_answer
        }

        const User = await User.update(newData, { where: {userId: id}});
        res.status(200).send(User);

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
        await User.destroy({where :{id: id}});
        res.status(200).send(`User with id: ${id} is deleted`);
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
    deleteUser
}