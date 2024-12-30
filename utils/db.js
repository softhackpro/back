const mongoose = require ("mongoose");
// require('dotenv').utils()
// mongoose.connect(URI);
const URI = process.env.MONGODB_URI;
const connectDB = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("connection established")
    } catch (error) {
        console.error("Connection Failed");
        process.exit(0);
    }
};
module.exports = connectDB;