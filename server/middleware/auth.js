import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import user from "../models/users.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {  // Make function async
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            error: {
                message: "Authorization token is missing",
                status: 401
            }
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // **Await** the database query
        const userData = await user.findById(decoded.id).select("email");
        if (!userData) {
            return res.status(404).json({
                error: {
                    message: "User not found",
                    status: 404
                }
            });
        }

        req.user = {
            id: decoded.id,
            email: userData.email // Now properly fetched
        };

        console.log("Authenticated User:", req.user);
        next();
    } catch (err) {
        return res.status(401).json({
            error: {
                message: "Invalid authorization token",
                status: 401
            }
        });
    }
};