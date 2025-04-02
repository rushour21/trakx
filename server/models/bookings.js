import mongoose from "mongoose";

const meeting = new mongoose.Schema({
    eventTopic: {
        type: String,
        required: true
    },
    meetingId: {
        type: String,
        required: false
    },
    hostName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dateTime: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    bannerTitle:{
        type: String,
        required: true
    },
    bannerColor:{
        type: String,
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    participants: [
        {
            email: { type: String, required: true },
            fullName : { type: String, required: true },
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
            role: { type: String, enum: ["creator", "participant"], required: true }
        }
    ],
    status: { 
        type: String, 
        enum: ["pending", "accepted", "rejected"], 
        default: "pending" 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})
export default mongoose.model('Meetings', meeting)