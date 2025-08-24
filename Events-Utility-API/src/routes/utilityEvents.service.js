const Event = require('../models/events');
const { v4 } = require('uuid');
const errors = require('../../errors/errors');
const Booking = require('../models/booking');

module.exports = async (req, res) => {
    try {
        const {type, userId, requestId} = req.body;
        if (type == 'bookings'){
            const bookings = await Booking.find({user: userId, isComplete: true, isCancelled: false}).populate('event');
            if (!bookings.length){
                return res.status(200).json({
                    statusCode: 1,
                    timestamp: Date.now(),
                    requestId: req.body.requestId || v4(),
                    info: {
                        code: errors['002'].code,
                        message: errors['002'].message,
                        displayText: errors['002'].displayText,
                    }
                });
            }

            return res.status(200).json({
                statusCode: 0,
                timestamp: Date.now(),
                requestId: req.body.requestId || v4(),
                data: {
                    events: bookings.filter((booking) => {
                        const eventDate = new Date(booking.event.datetime);
                        return eventDate >= new Date();    
                    }).map(booking => {
                        return {
                            _id: booking.event._id,
                            title: booking.event.title,
                            description: booking.event.description,
                            image: booking.event.image,
                            datetime: booking.event.datetime,
                            maxSeats: booking.event.maxSeats,
                            bookedSeatsArray: booking.event.bookedSeatsArray,
                            maxWaitlist: booking.event.maxWaitlist,
                            waitlistArray: booking.event.waitlistArray,
                            location: booking.event.location,
                            address: booking.event.address,
                            organizer: booking.event.organizer,
                            price: booking.event.price,
                            tags: booking.event.tags,
                            createdAt: booking.event.createdAt,
                            updatedAt: booking.event.updatedAt,
                            isWaitlist: booking.isWaitlist,
                            bookingType: booking.bookingType,
                            isComplete: booking.isComplete,
                            paymentId: booking.paymentIntentId,
                        }
                    }),
                },
                info: {
                    code: errors['000'].code,
                    message: errors['000'].message,
                    displayText: errors['000'].displayText,
                }
            });
        }
        else if (type == 'orders'){
            const bookings = await Booking.find({user: userId}).populate('event');
            if (!bookings.length){
                return res.status(200).json({
                    statusCode: 1,
                    timestamp: Date.now(),
                    requestId: req.body.requestId || v4(),
                    info: {
                        code: errors['002'].code,
                        message: errors['002'].message,
                        displayText: errors['002'].displayText,
                    }
                });
            }

            return res.status(200).json({
                statusCode: 0,
                timestamp: Date.now(),
                requestId: req.body.requestId || v4(),
                data: {
                    events: bookings.filter((booking) => {
                        const eventDate = new Date(booking.event.datetime);
                        return eventDate >= new Date();    
                    }).map(booking => {
                        return {
                            _id: booking.event._id,
                            title: booking.event.title,
                            description: booking.event.description,
                            image: booking.event.image,
                            datetime: booking.event.datetime,
                            maxSeats: booking.event.maxSeats,
                            bookedSeatsArray: booking.event.bookedSeatsArray,
                            maxWaitlist: booking.event.maxWaitlist,
                            waitlistArray: booking.event.waitlistArray,
                            location: booking.event.location,
                            address: booking.event.address,
                            organizer: booking.event.organizer,
                            price: booking.event.price,
                            tags: booking.event.tags,
                            createdAt: booking.event.createdAt,
                            updatedAt: booking.event.updatedAt,
                            isWaitlist: booking.isWaitlist,
                            bookingType: booking.bookingType,
                            isComplete: booking.isComplete,
                            isCancelled: booking.isCancelled,
                            paymentId: booking.paymentIntentId,
                            refundId: booking.refundId,
                            isRefundComplete: booking.isRefundComplete
                        }
                    }),
                },
                info: {
                    code: errors['000'].code,
                    message: errors['000'].message,
                    displayText: errors['000'].displayText,
                }
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId || v4(),
            info: {
                code: errors['002'].code,
                message: error.message || errors['002'].message,
                displayText: errors['002'].displayText,
            },
            error: error,
        });
    }
};
