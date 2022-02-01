// require the db created in the index file
const db = require('../models/index');

// to decrypt JWT for user id
const auth = require('./authController');

// get the Profiles model
const Profile = db.Profiles

const addProfile = async (req, res) => {
    let input_data = {
        ssn: req.body.ssn,
        account_number: req.body.account_number,
        routing_number: req.body.routing_number,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        userId: req.body.userId,
     }
     // using the builtin 'create' function on Profile Model
     const newProfile = await Profile.create(input_data)
     
     // send a 200 response with the created entry
     res.status(200).send(newProfile)
}

const getProfile = async (req, res) => {
    let id = req.params.id;
    let foundProfile = await Profile.findOne({where: {id: id}});
    res.status(200).send(foundProfile);
}

const updateProfile = async (req, res) => {
    let id = req.params.id

    // using the builtin 'findAll' function on Profile Model
    const Profile = await Profile.update(req.body, { where: {id: id}})
    res.status(200).send(Profile)
}

const deleteProfile = async (req, res) => {
    let id = req.params.id

    // using the builtin 'destroy' function on Profile Model
    await Profile.destroy({where :{id: id}})
    res.status(200).send(`Profile with id: ${id} is deleted`)
}

// export all the controller functions
module.exports = {
    addProfile,
    getProfile,
    updateProfile,
    deleteProfile
}