const {infoLogger, errorLogger} = require('../../logger/logger');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const errors = require('../../errors/errors')
const jwt = require('jsonwebtoken');
const { jwtSecretKey, jwtExpiryTime } = require('../../config/config');

async function loginService(req, res, next){
    try{
        infoLogger(req.custom.id, req.body.requestId, "Checking if email exists");
        // Check if user exists
        const userList = await User.find({email: req.body.email});
        if (!userList.length){
            infoLogger(req.custom.id, req.body.requestId, "User email doesn't exist");
            return res.status(401).json({
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

        infoLogger(req.custom.id, req.body.requestId, "Matching passwords");
        // Match passwords
        bcrypt.compare(req.body.password, userList[0].password, (err, isValid) => {
            if (err || !isValid){
                infoLogger(req.custom.id, req.body.requestId, "User password did not match");
                return res.status(401).json({
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

            infoLogger(req.custom.id, req.body.requestId, "Signing a JWT token");
            // Signing a token
            const token = jwt.sign({
                            user: userList[0].firstName,
                            email: userList[0].email,
                            userId: userList[0]._id,
                            isAdmin: userList[0].isAdmin,
                            organizerName: userList[0].organizerName,
                        },
                        jwtSecretKey,
                        {
                            expiresIn: jwtExpiryTime 
                        }
                        )

            return res.status(200).json({
                statusCode: 0,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                data: {
                    token
                },
                info: {
                    code: errors['000'].code,
                    message: errors['000'].message,
                    displayText: errors['000'].displayText
                }
            })

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


module.exports = loginService


