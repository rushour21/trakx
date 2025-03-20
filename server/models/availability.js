import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // References the User model
        required: true, 
        unique: true 
    },
    timeZone: { 
        type: String, 
        required: true, 
    },
    availability: {
        Monday: [{ startTime: String, endTime: String }],
        Tuesday: [{ startTime: String, endTime: String }],
        Wednesday: [{ startTime: String, endTime: String }],
        Thursday: [{ startTime: String, endTime: String }],
        Friday: [{ startTime: String, endTime: String }],
        Saturday: [{ startTime: String, endTime: String }],
        Sunday: [{ startTime: String, endTime: String }]
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields automatically
export default mongoose.model("UserAvailability", availabilitySchema);