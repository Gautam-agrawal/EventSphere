const {infoLogger, errorLogger} = require('../../logger/logger');
const User = require('../models/user');
const errors = require('../../errors/errors')

module.exports = async function (req, res, next){
    try{
        console.log(req.params.userId)
        const user = await User.findById(req.params.userId);
        if (!user){
            return res.status(200).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['001'].code,
                    message: errors['001'].message,
                    displayText: errors['001'].displayText
                }
            })
        }

        return res.status(200).json({
            statusCode: 0,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            data: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                about: user.about,
                isAdmin: user.isAdmin,
                userPic: user.userPic,
                country: user.country,
                streetAddress: user.streetAddress,
                lat: user.lat,
                long: user.long,
                city: user.city,
                state: user.state,
                zip: user.zip
            },
            info: {
                code: errors['000'].code,
                message: errors['000'].message,
                displayText: errors['000'].displayText
            }
        })
    } 
    catch(err){
        errorLogger(req.custom.id, req.body.requestId, `Unexpected error while searching by email id | ${err.message}`, err)
        return res.status(500).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
                code: errors['006'].code,
                message: err.message || errors['006'].message,
                displayText: errors['006'].displayText
            },
            error: err
        })
    }


}




