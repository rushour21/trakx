import express from "express";
import user from "../models/users.js";
import bcrypt from "bcrypt";
import { errorLogger } from "../middleware/log.js";
import { authMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/register", errorLogger, async (req, res) => {
    try {
        console.log(req.body);
        const { firstname, lastname, email, password } = req.body;
        // search for existing user via email or username
        console.log(firstname)
        const existingUser = await user.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email is already taken" });
        }
        else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new user({
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: hashedPassword,
            });
            await newUser.save();
            res.status(200).json({ message: "User created successfully", userId: newUser._id });
        }
    }
    catch (err) {
        errorLogger(err, req, res);
    }
});

router.post("/preference/:userId", errorLogger,  async (req, res) => {
    try {
        const { username, preference } = req.body;
        const { userId } = req.params;  // Get userId from URL
        // Find user by ID
        const existingUser = await user.findById(userId);

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the username is already taken
        if (username) {
            const usernameExists = await user.findOne({ userName: username });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already taken" });
            }
            existingUser.userName = username; // Set the username
        }
        // Update user preference
        if (preference) {
            existingUser.preference = preference;
        }
        await existingUser.save();

        res.status(200).json({
            message: "Username and preference updated successfully",
            username: existingUser.userName,
            preference: existingUser.preference
        });
    } catch (err) {
        errorLogger(err, req, res);
    }
});

router.post("/login", errorLogger, async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await user.findOne({ userName: username });
        console.log(existingUser) 
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid username" });
        }
        else {
            const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid password" });
            }
            const token = jwt.sign({
                id: existingUser._id,
                username: existingUser.userName
            }, process.env.JWT_SECRET, { expiresIn: "3h" });
            res.status(200).json({ message: "User logged in successfully", token: token });
        }
    }
    catch (err) {
        console.error("Error:", err);
        errorLogger(err, req, res);
    }
});

router.get("/getName", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const fullname = await user.findOne({ _id: userId }).select("firstName lastName");

        // Check if user is not found
        if (!fullname) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(fullname);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/profile", authMiddleware, errorLogger, async (req, res) => {
    try {
        
        const { firstname, lastname, email, password } = req.body;
        const userId = req.user.id;  // Get userId from URL
        console.log(req.user);
        console.log(userId);
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                error: {
                    message: "User not found",
                    status: 404
                }
            });
        }
        // Prepare update object
        let updateFields = {
            firstName: firstname || existingUser.firstName,
            lastName: lastname || existingUser.lastName,
            email: email || existingUser.email,
            updatedAt: Date.now()
        };

        // Hash password only if provided
        if (password) {
            updateFields.password = bcrypt.hashSync(password, 10);
        }

        // Update the user profile
        const updatedProfile = await user.findByIdAndUpdate(userId, updateFields, { new: true });

        res.status(200).json({ message: "Profile updated successfully", user: updatedProfile });
        }
    catch (err) {
        errorLogger(err, req, res);
    }
});
export default router;