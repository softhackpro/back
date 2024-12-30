// backend/models/orderModel.js

const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    user: { type: String, required: true },   // Store the user's ID or name
    Phone:{
        type: String,
        required: true
    },
    email:{type:String, required:true},
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    amount: { type: Number, required: true },   // Total order amount
    paymentStatus: { type: String, default: 'pending' }, // Payment status (pending, completed, failed)
    razorpay: {
        orderId: String,         // Razorpay order_id
        paymentId: String,       // Razorpay payment_id
        signature: String        // Razorpay signature for verification
    },
    createdAt: { type: Date, default: Date.now }
});
 
const Donor = new mongoose.model('Donor', DonorSchema);
module.exports = Donor;
