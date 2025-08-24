const { model, default: mongoose } = require('mongoose');
const Event = require('../models/events');
const errors = require('../../errors/errors');
const { errorLogger } = require('../../logger/logger');
const geo = require('mapbox-geocoding');
geo.setAccessToken('pk.eyJ1IjoicnV0dmlqMTIiLCJhIjoiY2todTk0djgyMGk5YTMwbzNwbGx5a2wzYiJ9.R86nYLWXN1qj-iQC5JNvLQ');


function isBase64(str) {
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    const { title, description, image, datetime, maxSeats, maxWaitlist, location, organizer, attendees, price, tags, address, userId, createdBy, chatId, chatAccessKey} = JSON.parse(req.body.toString());

    let selectedImage;

    if (image) {
      //split image at comma
      const splitImage = image.split(',');
      if (Array.isArray(splitImage)) {
        selectedImage = splitImage.length === 2 ? splitImage[1] : splitImage[0];
      } else {
        selectedImage = image;
      }

      if (!isBase64(selectedImage)) {
        return res.status(400).json({
          statusCode: 1,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['003'].code,
            message: errors['003'].message,
            displayText: errors['003'].displayText,
          },
        });
      }
    }

    try {

    geo.geocode('mapbox.places', [location, address].toString(), async function (err, geoData) {
    const newEvent = new Event({
      _id: new mongoose.Types.ObjectId(),
      title: title,
      description: description,
      image: selectedImage,
      datetime: new Date(+datetime).toISOString(),
      address: address,
      maxSeats: maxSeats,
      lat: geoData.features[0].center[1],
      long: geoData.features[0].center[0],
      maxWaitlist: maxWaitlist,
      location: geoData.features[0].place_name,
      organizer: organizer,
      chatId: chatId,
      chatAccessKey: chatAccessKey,
      price: price,
      tags: tags,
      createdBy: createdBy
    });

      const savedEvent = await newEvent.save();

      return res.status(201).json({
        statusCode: 0,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        data: {
          title: savedEvent.title,
          description: savedEvent.description,
          image: savedEvent.image,
          datetime: savedEvent.datetime,
          maxSeats: savedEvent.maxSeats,
          bookedSeatsArray: savedEvent.bookedSeatsArray,
          maxWaitlist: savedEvent.maxWaitlist,
          waitlistArray: savedEvent.waitlistArray,
          location: savedEvent.location,
          address: savedEvent.address,
          organizer: savedEvent.organizer,
          price: savedEvent.price,
          chatId: chatId,
          chatAccessKey: chatAccessKey,
          tags: savedEvent.tags,
          createdBy: savedEvent.createdBy
        },
        info: {
          code: errors['000'].code,
          message: errors['000'].message,
          displayText: errors['000'].displayText,
        },
      });
    })
    } catch (e) {
      errorLogger(req.custom.id, req.body.requestId, `Error while saving user in the database | ${e.message}`, e);

      return res.status(500).json({
        statusCode: 1,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        info: {
          code: errors['002'].code,
          message: e.message || errors['002'].message,
          displayText: errors['002'].displayText,
        },
        error: e,
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