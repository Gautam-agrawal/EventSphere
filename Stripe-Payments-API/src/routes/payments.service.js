const { model, default: mongoose } = require('mongoose');
const errors = require('../../errors/errors');
const { errorLogger } = require('../../logger/logger');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const Event = require('../models/events');
const Venue = require('../models/venue');
const Booking = require('../models/booking');
const {successUrl, failureUrl} = require('../../config/config')

module.exports = async (req, res) => {
  try {
    const {requestId, eventId, venueId, type, userId, email, timeslot, bookingId} = req.body;
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
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: event.title,
              },
              unit_amount: event.price*100,
            },
            quantity: 1,
          }
        ],
        success_url: successUrl,
        cancel_url: failureUrl,
        payment_intent_data: {
          metadata: {
            bookingId
          }
        },
        metadata : {
          bookingId
        }

      })

      return res.status(200).json({
        statusCode: 0,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        data: {
          url: session.url
        },
        info: {
          code: errors['000'].code,
          message: errors['000'].message,
          displayText: errors['000'].displayText,
        }
      });      
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: venue.title,
              },
              unit_amount: venue.price,
            },
            quantity: 1,
          }
        ],
        success_url: successUrl,
        cancel_url: failureUrl,
        payment_intent_data: {
          metadata: {
            bookingId
          }
        },
        metadata : {
          bookingId
        }
      })


      return res.status(200).json({
        statusCode: 0,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        data: {
          url: session.url
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