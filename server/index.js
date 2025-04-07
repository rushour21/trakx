import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import booking from "./routes/booking.js";
import user from "./routes/user.js";
import availabilityRoutes from "./routes/userAvailability.js";
import log from "./middleware/log.js";
import { errorLogger } from "./middleware/log.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ["https://trakx-five.vercel.app", "https://trakx.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorLogger);
app.use('/api/user', user); 
app.use('/api/booking', booking);
app.use('/api/availability', availabilityRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});