import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }

        // Allow all .vercel.app domains (production + previews)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// app.use(cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
//     credentials: true,
// }));

app.use(express.json({
    limit: "20kb"
}));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"))

app.use(cookieParser());

import { userRouter } from "./routes/user.route.js";
import courseRouter from './routes/course.route.js';
import enrolledRouter from './routes/enrollment.route.js';
import { errorHandler, notFound } from "./middlewares/error.middleware.js";


// route declaration
app.use("/api/v1/users", userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/enrollments', enrolledRouter);
//  localhost:8001/api/v1/users/register
// 404 handler (must be after all routes)
app.use(notFound);
// Global error handler (must be last)
app.use(errorHandler);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});




export default app;