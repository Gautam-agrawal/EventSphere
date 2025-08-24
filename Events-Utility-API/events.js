const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: Buffer,
    required: false,
  },
  datetime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  // organizer: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'user',
  // },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
  price: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;