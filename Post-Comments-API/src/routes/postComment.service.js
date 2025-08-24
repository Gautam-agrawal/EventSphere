const { model, default: mongoose } = require('mongoose');
const Event = require('../models/events');
const Comment = require('../models/comments');
const errors = require('../../errors/errors');
const { errorLogger } = require('../../logger/logger');
const geo = require('mapbox-geocoding');
geo.setAccessToken('pk.eyJ1IjoicnV0dmlqMTIiLCJhIjoiY2todTk0djgyMGk5YTMwbzNwbGx5a2wzYiJ9.R86nYLWXN1qj-iQC5JNvLQ');

module.exports = async (req, res) => {
    const {requestId, comment, userId, eventId, replyToId} = req.body;
    try{
      const foundEvent = await Event.findById(eventId);
      if (!foundEvent){
        return res.status(404).json({
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
      if (replyToId){
        const foundComment = await Comment.findById(replyToId);
        if (!foundComment){
          return res.status(404).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId,
            info: {
              code: errors['007'].code,
              message: errors['007'].message,
              displayText: errors['007'].displayText,
            },
          });
        }


        const reply = new Comment({
          _id: new mongoose.Types.ObjectId(),
          text: comment,
          author: {
            id: userId
          }
        });
  
        await reply.save();
        foundComment.replies.push(reply._id);
        await foundComment.save();
        
        return res.status(200).json({
          statusCode: 0,
          timestamp: Date.now(),
          requestId: req.body.requestId,
          info: {
            code: errors['000'].code,
            message: errors['000'].message,
            displayText: errors['000'].displayText
          },
        });
      }

      const newComment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        text: comment,
        author: {
          id: userId
        }
      });

      await newComment.save();
      foundEvent.comments.push(newComment._id);
      await foundEvent.save();

      return res.status(200).json({
        statusCode: 0,
        timestamp: Date.now(),
        requestId: req.body.requestId,
        info: {
          code: errors['000'].code,
          message: errors['000'].message,
          displayText: errors['000'].displayText
        },
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
}