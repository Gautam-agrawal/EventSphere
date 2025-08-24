const { model, default: mongoose } = require('mongoose');
const Event = require('../models/events');
const errors = require('../../errors/errors');
const { errorLogger } = require('../../logger/logger');
const Booking = require('../models/booking');
const Venue = require('../models/venue');
const deliverOtp = require('../helpers/deliverOtp');
const { bookingCancelEmailAlertsSubject, bookingConfirmEmailAlertsSubject, bookingConfirmEmailAlertsBody, bookingCancelEmailAlertsBody } = require('../../config/config');


module.exports = async (req, res) => {
  try {
    const {requestId, type, email, userId, bookingId} = req.body;
    if (type == "event"){
      const toBeCancelledBooking = await Booking.findOne({_id: bookingId, isCancelled: false}).populate('user');
      if (!toBeCancelledBooking){
        return res.status(200).json({
          statusCode: 1,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['007'].code,
            message: errors['007'].message,
            displayText: errors['007'].displayText,
          }
        });
      }

      const eventId = toBeCancelledBooking.event;
      const event = await Event.findById(eventId);
      if (!event){
        return res.status(200).json({
          statusCode: 1,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['003'].code,
            message: errors['003'].message,
            displayText: errors['003'].displayText,
          }
        });
      }
      if (toBeCancelledBooking.isWaitlist){
        event.waitlistArray = event.waitlistArray.filter(booking => booking != bookingId);
        event.save();
        toBeCancelledBooking.isCancelled = true;
        if(event.price == 0){
          toBeCancelledBooking.isRefundComplete = true;
        }
        toBeCancelledBooking.save();
        return res.status(200).json({
          statusCode: 0,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['002'].code,
            message: errors['002'].message,
            displayText: errors['002'].displayText,
          }
        });
      }

      if (event.waitlistArray.length){
        const cancelledBookingIdx = event.bookedSeatsArray.indexOf(bookingId);
        const firstInWaitingList = event.waitlistArray.shift();
        event.bookedSeatsArray[cancelledBookingIdx] = firstInWaitingList;
        event.save();

        const newlyBooked = await Booking.findById(firstInWaitingList).populate('user');
        newlyBooked.isWaitlist = false;

        newlyBooked.save();

        const cancelledUserEmail = toBeCancelledBooking.user.email;
        const newlyBookedUserEmail = newlyBooked.user.email;

        toBeCancelledBooking.isCancelled = true;
        if(event.price == 0){
          toBeCancelledBooking.isRefundComplete = true;
        }
        toBeCancelledBooking.save();

        deliverOtp({
          user: toBeCancelledBooking.user.firstName,
          emailSubject: bookingCancelEmailAlertsSubject,
          emailBody: bookingCancelEmailAlertsBody,
          requestId: requestId,
          email: cancelledUserEmail,
          id: req.custom.id,
          type: 'Event',
          name: event.title,
          datetime: event.datetime,
          bookingRefNo: bookingId,
        })

        deliverOtp({
          user: newlyBooked.user.firstName,
          emailSubject: bookingConfirmEmailAlertsSubject,
          emailBody: bookingConfirmEmailAlertsBody,
          requestId: requestId,
          email: newlyBookedUserEmail,
          id: req.custom.id,
          type: 'Event',
          name: event.title,
          datetime: event.datetime,
          bookingRefNo: firstInWaitingList,
        })
      }
      else{
        event.bookedSeatsArray = event.bookedSeatsArray.filter(booking => booking != bookingId);
        event.save();

        toBeCancelledBooking.isCancelled = true;
        if(event.price == 0){
          toBeCancelledBooking.isRefundComplete = true;
        }
        toBeCancelledBooking.save();

        deliverOtp({
          user: toBeCancelledBooking.user.firstName,
          emailSubject: bookingCancelEmailAlertsSubject,
          emailBody: bookingCancelEmailAlertsBody,
          requestId: requestId,
          email: toBeCancelledBooking.user.email,
          id: req.custom.id,
          type: 'Event',
          name: event.title,
          datetime: event.datetime,
          bookingRefNo: bookingId,
        })
      }
    }
    else if (type == "venue"){
      const toBeCancelledBooking = await Booking.findByIdAndDelete(bookingId).populate('user');
      const venueId = toBeCancelledBooking.venue;

      const venue = await Venue.findOneAndUpdate(
        { _id: venueId },
        { $pull: { bookedTime: { booking: bookingId } }},
        { returnDocument: 'before' }
      );

      const bookedTimeObj = venue.bookedTime.filter(bookedTimeObj => {
        return bookedTimeObj.booking == bookingId
      })

      deliverOtp({
        user: toBeCancelledBooking.user.firstName,
        emailSubject: bookingCancelEmailAlertsSubject,
        emailBody: bookingCancelEmailAlertsSubject,
        requestId: requestId,
        email: toBeCancelledBooking.user.email,
        id: req.custom.id,
        type: 'Venue',
        name: venue.title,
        datetime: `${bookedTimeObj.startTime} - ${bookedTimeObj.endTime}`,
        bookingRefNo: bookingId,
      })
    }

    return res.status(200).json({
      statusCode: 0,
      timestamp: Date.now(),
      requestId: req.body.requestId,
      info: {
        code: errors['000'].code,
        message: errors['000'].message,
        displayText: errors['000'].displayText,
      }
    });


    
    
  } catch (error) {
    console.log('Error:', error);
    errorLogger(req.custom.id, req.body.requestId, `Unexpected error | ${error.message}`, error);
    return res.status(500).json({
      statusCode: 1,
      timestamp: Date.now(),
      requestId: req.body.requestId,
      info: {
        code: errors['006'].code,
        message: error.message || errors['006'].message,
        displayText: errors['006'].displayText,
      },
      error: error,
    });
  }
};