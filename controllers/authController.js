// require the db created in the index file
const db = require('../models/index');

// get the Users model
const User = db.Users

const isLoggedIn = async (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    else{
        return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"});
    }
}

const logout = (req, res) => {
    req.logOut();
    res.status(200).json({
        message: "logout success"
    });
}

const getData = async (req, res) => {
    let authUser = await User.findOne({where: {email: req.session.passport.user}, include: db.Profiles});
        // CHECK IF USER IS VALID IN DB
        if(authUser){
            let userData = {
                id: authUser.dataValues.id,
                email: authUser.dataValues.email,
                phone: authUser.dataValues.phone,
                profile: authUser.dataValues.profile
            }
            res.status(200).json(userData);
        }
        else{
            res.status(200).json({
                message: "user not found in DB"
            });
        }
}

// export all the controller functions
module.exports = {
    isLoggedIn,
    logout,
    getData
}