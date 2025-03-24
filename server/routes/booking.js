import express from "express";
import { errorLogger } from "../middleware/log.js";
import { authMiddleware } from "../middleware/auth.js";
import { availabilityMiddleware } from "../middleware/checkAvailability.js";
import Meeting  from "../models/bookings.js";
const router = express.Router();

router.post("/bookingr", authMiddleware,availabilityMiddleware, async (req, res) => {
    try {
            console.log("Authenticated User email:", req.user.email); // Debugging l

        const { eventTopic, password, hostName, description, dateTime, duration, timezone,bannerTitle, bannerColor, meetingLink, allowedUser,  } = req.body;
        console.log("added mails",allowedUser)
         // Ensure allowedUser is formatted correctly and includes the creator's email
         const allUsers = [...new Set([...allowedUser.split(","), req.user.email])]
         console.log("allow mails",allUsers)
     // Convert to array of objects with email, status, and role
     const meetingUsers = allUsers.map(email => ({
         email,
         status: "pending",
         role: email === req.user.email ? "creator" : "invitors"
     }));

        const newMeeting  = new Meeting ({
            eventTopic,
            meetingId: password,
            hostName,
            description,
            dateTime,
            duration,
            timezone,
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
        const myMeetings = await Meeting.find({ createdBy: userId }).select("eventTopic dateTime meetingLink");

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


// Fetch pending meeting invitations for the user
router.get("/pending", authMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const pendingMeetings = await Meeting.find({ 
            participants: { 
                $elemMatch: { email: userEmail, status: "pending" } 
            },
        }).select("eventTopic dateTime duration participants");
        if (pendingMeetings.length === 0) {
            return res.status(200).json({
                message: "No pending meetings found",
                meetings: []
            });
        }
        res.status(200).json(pendingMeetings);
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
        }).select("eventTopic dateTime duration participants");
        if (upcomingMeetings.length === 0) {
            return res.status(200).json({
                message: "No upcoming meetings found",
                meetings: []
            });
        }
        res.status(200).json(upcomingMeetings);
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
        }).select("eventTopic dateTime duration participants");
        if (canceledMeetings.length === 0) {
            return res.status(200).json({
                message: "No canceled meetings found",
                meetings: []
            });
        }
        res.status(200).json(canceledMeetings);
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
        }).select("eventTopic dateTime duration participants");
        if (pastMeetings.length === 0) {
            return res.status(200).json({
                message: "No past meetings found",
                meetings: []
            });
        }
        res.status(200).json(pastMeetings);
    } catch (err) {
        errorLogger(err, req, res);
    }
});

export default router;