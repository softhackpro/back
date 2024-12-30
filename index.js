require('dotenv').config()
const express = require("express");

const app = express();
const cors = require("cors")
const router = require("./routes/auth-router")
const routere = require('./routes/router')
const paymentRouter = require('./routes/payment.routes');
const connectDB = require("./utils/db");
const errorMiddleware = require('./middlewares/error-middleware');
const path = require('path');
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/public/Images', express.static(path.join(__dirname, 'public/Images')));
app.use("/api/auth", router);
app.use("/api", routere);
app.use("/api/payments", paymentRouter);
app.use(errorMiddleware)
const PORT = process.env.PORT;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running: ${PORT}`);
    });
});
