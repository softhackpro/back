require('dotenv').config()
const Razorpay = require('razorpay');
const Donor = require('../models/donor');
const crypto = require('crypto');
const express = require("express");
const app = express();
app.use(express.static('public'));
const paymentRouter = express.Router();

// Razorpay instance 
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
paymentRouter.post('/create-order', async (req, res) => {
    const { amount, user, products, Phone, email } = req.body;
    
    const options = {
        amount: parseInt(amount, 10) * 100,  // Razorpay works in paise (₹500 = 50000 paise)
        currency: 'INR',
        receipt: 'order_rcptid_' + new Date().getTime()
    };

    try {
        const order = await razorpay.orders.create(options);
         
        // Create order in MongoDB
        const NewDonor = new Donor({
            user,
            products,
            amount,
            Phone,
            email,
            razorpay: { orderId: order.id }
        });
        
        await NewDonor.save();

        res.status(200).json({ order, NewDonor });
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
});

// Verify payment
paymentRouter.post('/verify-payment', async (req, res) => {
    const { order_id, payment_id, razorpay_signature } = req.body;

    // Find the order in the database
    const order = await Donor.findOne({ 'razorpay.orderId': order_id });

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the payment signature
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        order.paymentStatus = 'completed';
        order.razorpay.paymentId = payment_id;
        order.razorpay.signature = razorpay_signature;
        await order.save();

        res.status(200).json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
});
module.exports = paymentRouter;
