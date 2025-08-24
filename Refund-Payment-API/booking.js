const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: false },
  isWaitlist: { type: Boolean, default: false },
  bookingType: String,
  isComplete: { type: Boolean, default: false },
  isCancelled: { type: Boolean, default: false },
  stripeId: {type: String, default: null},
  chargeId: {type: String, default: null},
  paymentIntentId: {type: String, default: null},
  refundId: {type: String, default: null},
  isRefundComplete: { type: Boolean, default: false }
});
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
