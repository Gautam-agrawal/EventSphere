const {infoLogger, errorLogger} = require('../../logger/logger');
const User = require('../models/user');
const errors = require('../../errors/errors')
var geo = require('mapbox-geocoding');
geo.setAccessToken('pk.eyJ1IjoicnV0dmlqMTIiLCJhIjoiY2todTk0djgyMGk5YTMwbzNwbGx5a2wzYiJ9.R86nYLWXN1qj-iQC5JNvLQ');

module.exports = async function (req, res, next){
    try{
        const {requestId, userId, about, userPic, country, streetAddress, city, state, zip} = JSON.parse(req.body);
        geo.geocode('mapbox.places', [streetAddress, city, state, zip, country].toString(), async function (err, geoData) {
            console.log("geo", geoData)
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $set: {about, userPic, country, streetAddress, city, state, zip, lat: geoData.features[0].center[1], long: geoData.features[0].center[0] } },
                { new: true }
            );

            if (!updatedUser){
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
                info: {
                    code: errors['000'].code,
                    message: errors['000'].message,
                    displayText: errors['000'].displayText
                }
            })
        });
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




