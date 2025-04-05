import express from "express";
import { errorLogger } from "../middleware/log.js";
import { authMiddleware } from "../middleware/auth.js";
import { availabilityMiddleware } from "../middleware/checkAvailability.js";
import Meeting  from "../models/bookings.js";
import user from "../models/users.js"
const router = express.Router();

router.post("/bookingr", authMiddleware, availabilityMiddleware,  async (req, res) => {
    try {
            console.log("Authenticated User email:", req.user.email); // Debugging l
            console.log(req.body)
        const { eventTopic, password, hostName, description, dateTime, duration, timeZone,bannerTitle, bannerColor, meetingLink, allowedUser, date, time } = req.body;
        console.log("added mails",allowedUser)
         // Ensure allowedUser is formatted correctly and includes the creator's email
         const allUsers = [...new Set([...allowedUser.split(","), req.user.email])]
         console.log("allow mails",allUsers)

         const users = await user.find({ email: { $in: allUsers } });
        console.log(users)
     // Convert to array of objects with email, status, and role
     const meetingUsers = allUsers.map(email => {
        const user = users.find(u => u.email === email);
        const fullName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
        return {
          fullName, // Store full name
          email,
          status: "pending",
          role: email === req.user.email ? "creator" : "participant",
        };
      });

        const newMeeting  = new Meeting ({
            eventTopic,
            meetingId: password,
            hostName,
            description,
            dateTime,
            date,
            time,
            duration,
            timeZone,
            bannerTitle,
            bannerColor,
            meetingLink,
            participants: meetingUsers,
            createdBy: req.user.id
        });
        await newMeeting.save();
        res.status(200).json(newMeeting);
    }
    catch (err) {
        errorLogger(err, req, res);
    }
});


// Fetch meetings created by the user
router.get("/my-events", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const myMeetings = await Meeting.find({ createdBy: userId }).select("eventTopic dateTime meetingLink bannerTitle duration status");

        // Check if no meetings are found
        if (myMeetings.length === 0) {
            return res.status(200).json({
                message: "No meetings found",
                meetings: []
            });
        }
        res.status(200).json(myMeetings);
    } catch (err) {
        errorLogger(err, req, res);
    }
});

router.post("/my-events/status",  authMiddleware, async (req, res) => {
    const { meetingId, status } = req.body;

  try {
    const updated = await Meetings.findByIdAndUpdate(
      meetingId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

router.delete("/booking-d/:bookingId", authMiddleware, errorLogger,  async (req, res) => {
    try {
        const { bookingId } = req.params;
        const existingmeeting = await Meeting.findById(bookingId);
        if (!existingmeeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }
        await Meeting.deleteOne({ _id: bookingId });

        return res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
        console.error("Error deleting meeting:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
// Fetch pending meeting invitations for the user
router.get("/pending", authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const pendingMeetings = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail, status: "pending" } 
            },
        }).select("eventTopic dateTime duration participants bannerTitle");
        if (pendingMeetings.length === 0) {
            return res.status(200).json({
                message: "No pending meetings found",
                meetings: []
            });
        }
        res.status(200).json({ meetings: pendingMeetings, userEmail: userEmail });
    } catch (err) {
        errorLogger(err, req, res);
    }
});

// Fetch upcoming meeting for the user
router.get("/upcoming", authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const upcomingMeetings = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail, status: "accepted" } 
            },
            dateTime: { $gte: new Date() }
        }).select("eventTopic dateTime duration participants bannerTitle");
        if (upcomingMeetings.length === 0) {
            return res.status(200).json({
                message: "No upcoming meetings found",
                meetings: []
            });
        }
        res.status(200).json({ meetings: upcomingMeetings, userEmail: userEmail });
    } catch (err) {
        errorLogger(err, req, res);
    }
});


router.get("/canceled", authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const canceledMeetings = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail, status: "rejected" } 
            },
        }).select("eventTopic dateTime duration participants bannerTitle");
        if (canceledMeetings.length === 0) {
            return res.status(200).json({
                message: "No canceled meetings found",
                meetings: []
            });
        }
        res.status(200).json({ meetings: canceledMeetings, userEmail: userEmail });
    } catch (err) {
        errorLogger(err, req, res);
    }
});

// Fetch all and past meeting for the user
router.get("/past", authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const pastMeetings = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail} 
            },
            dateTime: { $lt: new Date() } 
        }).select("eventTopic dateTime duration participants bannerTitle");
        if (pastMeetings.length === 0) {
            return res.status(200).json({
                message: "No past meetings found",
                meetings: []
            });
        }
        res.status(200).json({ meetings: pastMeetings, userEmail: userEmail });
    } catch (err) {
        errorLogger(err, req, res);
    }
});

router.put("/past/:meetingId", authMiddleware, async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { statustoupdate } = req.body;
        const userEmail = req.user.email;

        if (!statustoupdate || (statustoupdate !== 'accepted' && statustoupdate !== 'rejected')) {
            return res.status(400).json({ error: 'Invalid status value. Must be "accepted" or "rejected".' });
        }

        // Use findOneAndUpdate to directly update the status of a specific participant
        const meeting = await Meeting.findOneAndUpdate(
            { _id: meetingId, "participants.email": userEmail },
            { $set: { "participants.$.status": statustoupdate } }, // Update the participant's status
            { new: true } // Return the updated document
        );

        if (!meeting) {
            return res.status(404).json({ error: "Meeting not found or user not a participant" });
        }

        res.status(200).json({ message: "Status updated successfully", meeting });
    } catch (error) {
        console.error("Error updating meeting status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/pending/updateStatus", authMiddleware, async (req, res) => {
    
    try {
        const { status, bookingId } = req.body;
        const userEmail = req.user.email;
        console.log(req.body)
        console.log(userEmail)
        if (!status || (status !== 'accepted' && status !== 'rejected')) {
            return res.status(400).json({ error: 'Invalid status value. Must be "accepted" or "rejected".' });
        }

        // Use findOneAndUpdate to directly update the status of a specific participant
        const meeting = await Meeting.findOneAndUpdate(
            { _id: bookingId, "participants.email": userEmail },
            { $set: { "participants.$.status": status } }, // Update the participant's status
            { new: true } // Return the updated document
        );
        if (!meeting) {
            return res.status(404).json({ error: "Meeting not found or user not a participant" });
        }

        res.status(200).json({ message: "Status updated successfully", meeting });
    } catch (error) {
        console.error("Error updating meeting status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/meetings", authMiddleware, async (req,res) => {
    try {
        const userEmail = req.user.email;
        const Meetingevents = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail} 
            }}).select("eventTopic date time bannerTitle")

            if (Meetingevents.length === 0) {
                return res.status(200).json({
                    message: "No past meetings found",
                    Meetingevents: []
                });
            }
            res.status(200).json({ Meetingevents });
    } catch (error) {
        errorLogger(err, req, res);
    }
})
export default router;