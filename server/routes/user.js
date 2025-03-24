import express from "express";
import user from "../models/users.js";
import bcrypt from "bcrypt";
import { errorLogger } from "../middleware/log.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        // search for existing user via email or username
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
            res.status(200).json({ message: "User created successfully" });
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
                username: existingUser.username
            }, process.env.JWT_SECRET, { expiresIn: "3h" });
            res.status(200).json({ message: "User logged in successfully", token: token });
        }
    }
    catch (err) {
        console.error("Error:", err);
        errorLogger(err, req, res);
    }
});


export default router;