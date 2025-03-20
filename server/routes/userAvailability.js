import express from "express";
import Availability from "../models/availability.js";
import { errorLogger } from "../middleware/log.js";

const router = express.Router();

router.post("/availability", errorLogger, async (req, res) => {
    try {
        const { userId, timeZone, availability } = req.body;

        // Check if the user's availability already exists
        const existingAvailability = await Availability.findOne({ userId });

        if (existingAvailability) {
            existingAvailability.timeZone = timeZone;
            existingAvailability.availability = availability;
            await existingAvailability.save();
            return res.status(200).json({ message: "Availability updated successfully!" });
        } else {
            const newAvailability = new Availability({
                userId,
                timeZone,
                availability
            });
            await newAvailability.save();
            res.status(200).json({ message: "Availability set successfully!" });
        }
    } catch (error) {
        errorLogger(error, req, res);
    }
});

export default router;