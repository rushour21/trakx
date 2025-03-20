import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
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
        console.log(decoded)
        req.user = decoded;
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