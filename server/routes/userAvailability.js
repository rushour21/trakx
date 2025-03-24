import express from "express";
import Availability from "../models/availability.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { availability, timeZone } = req.body;
        const userId = req.user.id; // Assuming authMiddleware attaches user info

        if (!availability || !timeZone) {
            return res.status(400).json({ message: "Availability and timezone are required." });
        }

        let userAvailability = await Availability.findOne({ userId });

        if (userAvailability) {
            // Update existing record
            userAvailability.availability = availability;
            userAvailability.timeZone = timeZone;
            await userAvailability.save();
            return res.status(200).json({ message: "Availability updated successfully", userAvailability });
        } else {
            // Create new record
            userAvailability = new Availability({
                userId,
                timeZone,
                availability
            });
            await userAvailability.save();
            return res.status(201).json({ message: "Availability added successfully", userAvailability });
        }
    } catch (err) {
        console.error("Error adding/updating availability:", err);
        errorLogger(err, req, res);
    }
});


export default router;