const mongoose = require('mongoose');
require('./booking')

const venueSchema = new mongoose.Schema({
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
    type: String,
    required: false,
  },
  openTime: {
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
  },
  bookedTime: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  }],
  location: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: [
    {
      type: String,
      required: false,
    },
  ],
}, {
  timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
});

// Create the Event model
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;