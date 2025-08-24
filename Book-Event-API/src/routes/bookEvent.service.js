const { model, default: mongoose } = require('mongoose');
const Event = require('../models/events');
const errors = require('../../errors/errors');
const { errorLogger } = require('../../logger/logger');
const Booking = require('../models/booking');
const Venue = require('../models/venue');
const User = require('../models/users');
const { bookingConfirmEmailAlertsSubject, bookingConfirmEmailAlertsBody } = require('../../config/config');
const deliverOtp = require('../helpers/deliverOtp');

module.exports = async (req, res) => {
  try {
    const {requestId, eventId, venueId, type, email, userId, timeSlot} = req.body;
    const user = await User.findById(userId);

    if (!user){
      return res.status(500).json({
        statusCode: 1,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        info: {
          code: errors['012'].code,
          message: errors['012'].message,
          displayText: errors['012'].displayText,
        }
      });
    }

    if (type == "event"){
      const event = await Event.findById(eventId);
      if (!event){
        return res.status(500).json({
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

      const bookings = await Booking.findOne({
        user: userId,
        event: eventId,
        isCancelled: false
      })

      if (bookings && (Object.keys(bookings).length)){
        if (bookings.isComplete){
          return res.status(200).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
              code: errors['011'].code,
              message: errors['011'].message,
              displayText: errors['011'].displayText,
            }
          });
        }
        else{
          return res.status(200).json({
            statusCode: 0,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            data: {
              bookingId: bookings._id,
              userId: bookings.user,
              eventId: bookings.event,
              isWaitlisted: bookings.isWaitlist,
              bookingType: bookings.bookingType,
              isComplete: bookings.isComplete,
              event: event
            },
            info: {
              code: errors['013'].code,
              message: errors['013'].message,
              displayText: errors['013'].displayText,
            }
          });
        }
      }

      if (event.bookedSeatsArray.length >= event.maxSeats){
        if (event.waitlistArray.length == event.maxWaitlist){
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

        const newBooking = new Booking({
          user: userId,
          event: eventId,
          bookingType: type,
          isWaitlist: true,
        });
        
        const savedBooking = await newBooking.save();
        const newEvent = await Event.findByIdAndUpdate(eventId, {
          $push: { waitlistArray: savedBooking._id },
        }, {new: true});

        return res.status(200).json({
          statusCode: 0,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          data: {
            bookingId: savedBooking._id,
            userId: savedBooking.user,
            eventId: savedBooking.event,
            isWaitlisted: savedBooking.isWaitlist,
            bookingType: savedBooking.bookingType,
          },
          info: {
            code: errors['008'].code,
            message: errors['008'].message,
            displayText: errors['008'].displayText,
          }
        });
      }
      else{
        const newBooking = new Booking({
          user: userId,
          event: eventId,
          bookingType: type,
          isWaitlist: false
        });

        const savedBooking = await newBooking.save();
        const newEvent = await Event.findByIdAndUpdate(eventId, {
          $push: { bookedSeatsArray: savedBooking._id },
        }, { new: true });


        deliverOtp({
          user: user.firstName,
          emailSubject: bookingConfirmEmailAlertsSubject,
          emailBody: bookingConfirmEmailAlertsBody,
          requestId: requestId,
          email: user.email,
          id: req.custom.id,
          type: 'Event',
          name: newEvent.title,
          datetime: newEvent.datetime,
          bookingRefNo: newBooking._id,
        })

        return res.status(200).json({
          statusCode: 0,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          data: {
            bookingId: savedBooking._id,
            userId: savedBooking.user,
            eventId: savedBooking.event,
            isWaitlisted: savedBooking.isWaitlist,
            bookingType: savedBooking.bookingType,
            isCompleted: savedBooking.isComplete,
            isCancelled: savedBooking.isCancelled,
            event: newEvent
          },
          info: {
            code: errors['000'].code,
            message: errors['000'].message,
            displayText: errors['000'].displayText,
          }
        });

      }
    }
    else if (type == 'venue'){
      const venue = await Venue.findById(venueId);
      if (!venue){
        return res.status(500).json({
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

      const bookings = await Booking.find({
        user: userId,
        venue: venueId
      })

      if ((Object.keys(bookings).length)){
        return res.status(200).json({
          statusCode: 1,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['011'].code,
            message: errors['011'].message,
            displayText: errors['011'].displayText,
          }
        });
      }

      const fromHours = new Date(timeSlot.from).getHours()
      const toHours = new Date(timeSlot.to).getHours()
      if (fromHours >= venue.openTime.startTime && toHours <= venue.openTime.endTime){
        const isBookingPossible = venue.bookedTime.every((existingBooking) => {
          const isOverlap =
            startTime >= existingBooking.endTime || endTime <= existingBooking.startTime;
          return !isOverlap;
        });

        if (!isBookingPossible){
          return res.status(200).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
              code: errors['010'].code,
              message: errors['010'].message,
              displayText: errors['010'].displayText,
            }
          });
        }

        const newBooking = new Booking({
          user: userId,
          event: eventId,
          bookingType: type,
        });

        savedBooking = await newBooking.save();
        const fromTime = new Date(timeSlot.from);
        const toTime = new Date(timeSlot.to);
        const updatedVenue = await Venue.findByIdAndUpdate(
          venueId,
          {
            $push: {
              bookedTime: {
                startTime: fromTime,
                endTime: toTime,
                booking: newBooking.booking,
              },
            },
          },
          { new: true }
        );

        deliverOtp({
          user: user.firstName,
          emailSubject: bookingConfirmEmailAlertsSubject,
          emailBody: bookingConfirmEmailAlertsBody,
          requestId: requestId,
          email: user.email,
          id: req.custom.id,
          type: 'Venue',
          name: updatedVenue.title,
          datetime: `${fromTime} - ${toTime}`,
          bookingRefNo: newBooking._id,
        })

        return res.status(200).json({
          statusCode: 0,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          data: {
            bookingId: savedBooking._id,
            userId: savedBooking.user,
            venueId: savedBooking.venue,
            bookingType: savedBooking.bookingType,
            isCompleted: savedBooking.isComplete,
            isCancelled: savedBooking.isCancelled,
            venue: updatedVenue
          },
          info: {
            code: errors['000'].code,
            message: errors['000'].message,
            displayText: errors['000'].displayText,
          }
        });
      }
      else{
        return res.status(200).json({
          statusCode: 1,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['009'].code,
            message: errors['009'].message,
            displayText: errors['009'].displayText,
          }
        });
      }


    }
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