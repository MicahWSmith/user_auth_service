// require the db created in the index file
const db = require('../models/index');

// get the Users model
const User = db.Users

const isLoggedIn = async (req, res, next) => {
    if(req.session.email){
        return next();
    }
    else{
        return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"});
    }
}

const logout = (req, res) => {
    req.session.destroy();
    res.status(200);
}

const getData = async (req, res) => {
    res.json({
        userId: req.session.user
    });
}

const authenticateUser = async (req, res) => {

        let email = req.body.email;
        let password = req.body.password;

        let authUser = await User.findOne({where: {email: email, password: password}, include: db.Profiles})
        // CHECK IF USER IS VALID IN DB
        if(authUser){
            req.session.user = authUser.dataValues.id;
            req.session.email = authUser.dataValues.email;

            let userData = {
                id: authUser.dataValues.id,
                email: authUser.dataValues.email,
                phone: authUser.dataValues.phone,
                profile: authUser.dataValues.profile
            }
            res.status(200).json(userData);
        }
}

// export all the controller functions
module.exports = {
    authenticateUser,
    isLoggedIn,
    logout,
    getData
}