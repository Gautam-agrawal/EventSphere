const {infoLogger, errorLogger} = require('../../logger/logger');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const errors = require('../../errors/errors')

async function signUpService(req, res, next){
    try{
        infoLogger(req.custom.id, req.body.requestId, "Checking if user data is already present in the db")
        // Find if user exists
        const usersFromDb = await User.find({email: req.body.email});
        if (usersFromDb.length){
            infoLogger(req.custom.id, req.body.requestId, "User data is already present in the db")
            res.header('Access-Control-Allow-Origin', '*');
            return res.status(409).json({
                statusCode: 1,
                timestamp: Date.now(),
                requestId: req.body.requestId,
                info: {
                    code: errors['003'].code,
                    message: errors['003'].message,
                    displayText: errors['003'].displayText
                },
            })
        }

        // Hash the password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err){
                infoLogger(req.custom.id, req.body.requestId, "Error in hashing the password")
                return res.status(500).json({
                    statusCode: 1,
                    timestamp: Date.now(),
                    requestId: req.body.requestId,
                    info: {
                        code: errors['001'].code,
                        message: err.message || errors['001'].message,
                        displayText: errors['001'].displayText
                    },
                    error: err
                })
            }
            infoLogger(req.custom.id, req.body.requestId, "Password hashed successfully")
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isAdmin: req.body.role == 'organizer' ? true : false,
                organizerName: req.body.organizerName
            });

            try{
                // Save the user
                await newUser.save();
                infoLogger(req.custom.id, req.body.requestId, "User saved successfully")
                return res.status(201).json({
                    statusCode: 0,
                    timestamp: Date.now(),
                    requestId: req.body.requestId,
                    info: {
                        code: errors['000'].code,
                        message: errors['000'].message,
                        displayText: errors['000'].displayText,
                    }
                })
            }
            catch(e){
                errorLogger(req.custom.id, req.body.requestId, `Error while saving user in the database | ${e.message}`, e)
                return res.status(500).json({
                    statusCode: 1,
                    timestamp: Date.now(),
                    requestId: req.body.requestId,
                    info: {
                        code: errors['002'].code,
                        message: e.message || errors['002'].message,
                        displayText: errors['002'].displayText
                    },
                    error: e
                })
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


module.exports = signUpService


