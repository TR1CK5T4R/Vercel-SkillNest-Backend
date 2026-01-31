import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Refresh access token using refresh token
 * @route POST /api/users/refresh-token
 * @access Public (but requires valid refresh token)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from cookies or request body
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        // Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user by ID from decoded token
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // Check if the refresh token exists in user's refreshTokens array
        const isTokenValid = user.refreshToken.includes(incomingRefreshToken);

        if (!isTokenValid) {
            throw new ApiError(401, "Refresh token is expired or already used");
        }

        // Generate new access token
        const newAccessToken = user.generateAccessToken();

        // Optionally generate new refresh token and replace the old one
        const newRefreshToken = user.generateRefreshToken();

        // Remove old refresh token and add new one
        user.refreshToken = user.refreshToken.filter(
            (token) => token !== incomingRefreshToken
        );
        user.refreshToken.push(newRefreshToken);
        await user.save({ validateBeforeSave: false });

        // Cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        // Send response with new tokens
        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});