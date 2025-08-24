const stripe = require('stripe')('sk_test_51OHDeCK7GfM9YjkRYoPXjm075Rqc0k0UY86a3hEC37kDjjXZF05PaXVQbEQZe4h7dXCt2zorlyc25updlmXIax3200ECUdLuC2');
const Booking = require('./booking');
const { default: mongoose } = require('mongoose');
const path = require('path');

mongoose.connect('mongodb+srv://ems-db.ehsz9n7.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    ssl: true,
    tlsCertificateKeyFile: path.join(__dirname, 'mongodb-atlas-ssl-cert.pem'),
    authMechanism: 'MONGODB-X509',
    authSource: '$external'
})

async function get_pending_refund_bookings(){
  return await Booking.find({
    isCancelled: true,
    isComplete: true,
    isRefundComplete: false
  });
}

async function refund_payment(){
  pendingRefunds = await get_pending_refund_bookings()
  console.log("pending refunds", pendingRefunds);
  pendingRefunds.forEach(async (pendingRefund) => {
    try{
      const refund = await stripe.refunds.create({
        charge: pendingRefund.chargeId
      });
      console.log(refund);
      pendingRefund.isRefundComplete = true;
      pendingRefund.refundId = refund.id

      await pendingRefund.save();
      console.log(`Booking with ID ${pendingRefund._id} refunded successfully`);
    }
    catch(e){
      console.error(`Error refunding booking with ID ${pendingRefund._id}:`, e.message);
    }
  })
}

module.exports.refundPaymentBatch = async (event, context) => {
  const time = new Date();
  console.log(`Refund Payment Batch job ran at ${time}`);
  await refund_payment();
};