import UserAvailability from "../models/availability.js"; 

export const availabilityMiddleware = async (req, res, next) => {
    try {
        const { date, time, duration } = req.body;  // Now we get `date` and `time` separately
        const userId = req.user.id;

        console.log(req.body);

        // Combine date and time into a Date object
        const dateTimeString = `${date}T${time}:00`;  // e.g., "2025-04-21T09:00:00"
        const meetingStart = new Date(dateTimeString);

        if (isNaN(meetingStart)) {
            return res.status(400).json({ error: "Invalid date or time format." });
        }

        const meetingEnd = new Date(meetingStart.getTime() + duration * 60000);

        const meetingDay = meetingStart.toLocaleDateString("en-US", { weekday: "long" });

        const userAvailability = await UserAvailability.findOne({ userId });

        if (!userAvailability) {
            return res.status(400).json({ error: "User availability not set. Please update your availability." });
        }

        const availableSlots = userAvailability.availability[meetingDay] || [];

        const isAvailable = availableSlots.some(slot => {
            const slotStart = convertToDateTime(meetingStart, slot.startTime);
            const slotEnd = convertToDateTime(meetingStart, slot.endTime);

            return meetingStart >= slotStart && meetingEnd <= slotEnd;
        });

        console.log(isAvailable);

        if (!isAvailable) {
            return res.status(400).json({
                error: `You are not available on ${meetingDay} at this time.`,
                alert: "User not available",
                message: "not available at this time"
            });
        }

        next();
    } catch (err) {
        console.error("Error in availabilityMiddleware:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Helper: Convert "HH:MM" to Date object on same day as referenceDate
const convertToDateTime = (referenceDate, timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(referenceDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};
