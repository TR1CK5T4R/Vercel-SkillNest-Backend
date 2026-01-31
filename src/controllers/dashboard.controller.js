import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

/**
 * Get user dashboard data
 * @route GET /api/users/dashboard
 * @access Private (requires authentication)
 */
export const getUserDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming verifyJWT middleware attaches user to req

    // Fetch user data and populate enrolled courses
    const user = await User.findById(userId)
        .select("-password -refreshTokens") // Exclude sensitive fields
        .populate({
            path: "enrolledCourses",
            select: "title description category price duration videoFile",
        });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        enrolledCourses: user.enrolledCourses,
                    },
                },
                "User dashboard data fetched successfully"
            )
        );
});

/**
 * Get current logged-in user profile
 * @route GET /api/users/profile
 * @access Private (requires authentication)
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshTokens");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});