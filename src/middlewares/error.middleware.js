import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

/**
 * Global Error Handling Middleware
 * Catches all errors and returns consistent JSON responses
 */
export const errorHandler = (err, req, res, next) => {
    let error = err;

    // If error is not an instance of ApiError, convert it
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? 400 : 500;

        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // Prepare error response
    const response = {
        success: false,
        message: error.message,
        ...(error.errors.length > 0 && { errors: error.errors }),
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    };

    // Handle specific error types

    // 1. MongoDB Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        error.message = "Validation failed";
        error.statusCode = 400;
        response.errors = errors;
    }

    // 2. MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `${field} already exists`;
        error.statusCode = 409;
    }

    // 3. MongoDB CastError (Invalid ObjectId)
    if (err.name === "CastError") {
        error.message = `Invalid ${err.path}: ${err.value}`;
        error.statusCode = 400;
    }

    // 4. JWT Errors
    if (err.name === "JsonWebTokenError") {
        error.message = "Invalid token. Please login again";
        error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        error.message = "Token expired. Please login again";
        error.statusCode = 401;
    }

    // 5. Multer File Upload Errors
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            error.message = "File size is too large";
            error.statusCode = 400;
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            error.message = "Unexpected file field";
            error.statusCode = 400;
        } else {
            error.message = err.message;
            error.statusCode = 400;
        }
    }

    // 6. Cloudinary Errors
    if (err.message && err.message.includes("cloudinary")) {
        error.message = "File upload failed. Please try again";
        error.statusCode = 500;
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
        console.error("ERROR 💥:", err);
    }

    // Send error response
    return res.status(error.statusCode).json(response);
};

/**
 * 404 Not Found Middleware
 * Handles requests to undefined routes
 */
export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};