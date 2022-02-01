// require the db created in the index file
const db = require('../models/index');

// to decrypt JWT for user id
const auth = require('./authController');

// get the Profiles model
const Profile = db.Profiles

const addProfile = async (req, res) => {
    try{
        const id = auth.decryptToken(req.body.token).data.id;
        const input_data = {
            ssn: req.body.ssn,
            account_number: req.body.account_number,
            routing_number: req.body.routing_number,
            street_address: req.body.street_address,
            city: req.body.city,
            state: req.body.state,
            userId: id,
         }
         // using the builtin 'create' function on Profile Model
         const newProfile = await Profile.create(input_data);
         
         // send a 200 response with the created entry
         res.status(200).send(newProfile);

    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}

const getProfile = async (req, res) => {
    try{
        const id = auth.decryptToken(req.body.token).data.id;
        const foundProfile = await Profile.findOne({where: {userId: id}});
        res.status(200).send(foundProfile);
    }
    catch(e){
        res.status(400).json({
            error: e
        });
    }
}

const updateProfile = async (req, res) => {
    try{
        const id = auth.decryptToken(req.body.token).data.id;
        const newData = {
            ssn: req.body.ssn,
            account_number: req.body.account_number,
            routing_number: req.body.routing_number,
            street_address: req.body.street_address,
            city: req.body.city,
            state: req.body.state,
        }

        // using the builtin 'findAll' function on Profile Model
        const Profile = await Profile.update(newData, { where: {id: id}});
        res.status(200).send(Profile);

    } catch(e){
        res.status(400).json({
            error: e
        });
    }
}

const deleteProfile = async (req, res) => {
    try{
        const id = auth.decryptToken(req.body.token).data.id;
    
        // using the builtin 'destroy' function on Profile Model
        await Profile.destroy({where :{userId: id}})
        res.status(200).send(`Profile for user: ${id} is deleted`);
    }
    catch(e){
        res.status(400).json({
            error: e
        });
    }
}

// export all the controller functions
module.exports = {
    addProfile,
    getProfile,
    updateProfile,
    deleteProfile
}