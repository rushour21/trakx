import express from "express";
import { errorLogger } from "../middleware/log.js";
import { authMiddleware } from "../middleware/auth.js";
import Meeting  from "../models/bookings.js";
const router = express.Router();

router.post("/booking", authMiddleware, async (req, res) => {
    try {
        const { eventTopic, password, hostName, description, dateTime, duration, timezone,bannerTitle, bannerColor, meetingLink, allowedUser,  } = req.body;
        const meetingUsers = allowedUser.split(",").map(allowedUser => allowedUser.trim());
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
        const myMeetings = await Meeting.find({ createdBy: userId });

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
            "participants.email": userEmail, 
            "participants.status": "pending"
        });
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
            "participants.email": userEmail, 
            "participants.status": "accepted",
            dateTime: { $gte: new Date() }
        });
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
            "participants.email": userEmail, 
            "participants.status": "rejected"
        });
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
            "participants.email": userEmail,
            dateTime: { $lt: new Date() } 
        });
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