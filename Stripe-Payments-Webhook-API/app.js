const stripe = require('stripe')('sk_test_51OHDeCK7GfM9YjkRYoPXjm075Rqc0k0UY86a3hEC37kDjjXZF05PaXVQbEQZe4h7dXCt2zorlyc25updlmXIax3200ECUdLuC2');
const express = require('express');
const app = express();
const axios = require('axios');
const Booking = require('./booking');
const { default: mongoose } = require('mongoose');
const path = require('path');
const endpointSecret = 'whsec_A8uNy3NNTJ04HCWNMqha2aO2zbjcnspB'
app.post('/payments/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log(event)
  console.log(event.data.object.metadata)
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log("checkout.session.completed")
        const metadata = event.data.object.metadata;
        console.log("METADATA", metadata)
        const updatedBooking1 = await Booking.findByIdAndUpdate(
            metadata.bookingId,
            { $set: { stripeId: event.id, isComplete: true} },
            { new: true } // To return the updated document
          )
        
        console.log(updatedBooking1)
      break;
      case 'payment_intent.succeeded':
        console.log("payment_intent.succeeded")
          const latest_charge = event.data.object.latest_charge;
          console.log("METADATA", event.data.object.metadata)
          const updatedBooking2 = await Booking.findByIdAndUpdate(event.data.object.metadata.bookingId , { $set: { chargeId: latest_charge, paymentIntentId: event.data.object.id } }, { new: true });
          console.log(updatedBooking2)
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

mongoose.connect('mongodb+srv://ems-db.ehsz9n7.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    ssl: true,
    tlsCertificateKeyFile: path.join(__dirname, 'mongodb-atlas-ssl-cert.pem'),
    authMechanism: 'MONGODB-X509',
    authSource: '$external'
})

module.exports = app;