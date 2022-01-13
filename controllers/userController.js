// require the db created in the index file
const db = require('../models/index')


// get the Users model
const User = db.Users

const addUser = async (req, res) => {
    let input_data = {
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        security_question: req.body.security_question,
        security_answer: req.body.security_answer,
     }
     // using the builtin 'create' function on User Model
     const newUser = await User.create(input_data)
     
     // send a 200 response with the created entry
     res.status(200).send(newUser)
}

const getUser = async (req, res) => {
    let id = req.params.id;

    let foundUser = await User.findOne({where: {id: id}, include: db.Profiles});
    res.status(200).send(foundUser);
}

const authenticateUser = async (req, res) => {
    // type can be login or validate
    let type = req.params.type;

    if(type == "login"){
        // getting vars from the params in the req
        let email = req.body.email;
        let password = req.body.password;

        let authUser = await User.findOne({where: {email: email, password: password}})
        res.status(200).send(authUser)
    }
    else if(type == "validate"){
        //TODO: compare users session token to stored session token
        res.send("I need to write token validating code!!!");
    }
    else{
        res.send("Alas... nothing happened. Available endpoints for the auth route include 'validate' and 'login'");
    }
}

const updateUser = async (req, res) => {
    let id = req.params.id

    // using the builtin 'findAll' function on User Model
    const User = await User.update(req.body, { where: {id: id}})
    res.status(200).send(User)
}

const deleteUser = async (req, res) => {
    let id = req.params.id

    // using the builtin 'destroy' function on User Model
    await User.destroy({where :{id: id}})
    res.status(200).send(`User with id: ${id} is deleted`)
}

// export all the controller functions
module.exports = {
    addUser,
    getUser,
    authenticateUser,
    updateUser,
    deleteUser
}