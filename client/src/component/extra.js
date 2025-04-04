console.log(2+'3')
export const availabilityMiddleware = async (req, res, next) => {
  try {
      const { dateTime, duration } = req.body;  // Extract meeting date and duration
      const userId = req.user.id;  // Get the user ID from authentication middleware
      console.log(req.body)
      // Convert dateTime to a Date object
      const meetingStart = new Date(dateTime);
      const meetingEnd = new Date(meetingStart.getTime() + duration * 60000);  // Add duration in minutes

      // Extract the day of the week (e.g., "Monday")
      const meetingDay = meetingStart.toLocaleDateString("en-US", { weekday: "long" });

      // Fetch user availability from DB
      const userAvailability = await UserAvailability.findOne({ userId });

      if (!userAvailability) {
          return res.status(400).json({ error: "User availability not set. Please update your availability." });
      }

      // Get available slots for the meeting day
      const availableSlots = userAvailability.availability[meetingDay] || [];

      // Check if the meeting falls within any available slot
      const isAvailable = availableSlots.some(slot => {
          const slotStart = convertToDateTime(meetingStart, slot.startTime);
          const slotEnd = convertToDateTime(meetingStart, slot.endTime);

          return meetingStart >= slotStart && meetingEnd <= slotEnd;
      });
      console.log( isAvailable)
      if (!isAvailable) {
          return res.status(400).json({ error: `You are not available on ${meetingDay} at this time.`,
          alert:"you  n",
          message: "not available at this time" });
      }

      next(); // Proceed to the next middleware if available
  } catch (err) {
      console.error("Error in checkAvailabilityMiddleware:", err);
      res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to convert "HH:MM" string to Date object
const convertToDateTime = (referenceDate, timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(referenceDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};
