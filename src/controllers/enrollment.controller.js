import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";

/**
 * Enroll user in a course
 * @route POST /api/enrollments/:courseId
 * @access Private (requires authentication)
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id; // Assuming verifyJWT middleware attaches user to req

    // Validate course exists
    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user is already enrolled
    const isAlreadyEnrolled = user.enrolledCourses.includes(courseId);

    if (isAlreadyEnrolled) {
        throw new ApiError(400, "You are already enrolled in this course");
    }

    // Enroll user in the course
    user.enrolledCourses.push(courseId);
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    courseId,
                    courseTitle: course.title,
                },
                "Successfully enrolled in the course"
            )
        );
});

/**
 * Get all enrolled courses for the authenticated user
 * @route GET /api/enrollments
 * @access Private (requires authentication)
 */
export const getEnrolledCourses = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find user and populate enrolled courses
    const user = await User.findById(userId).populate(
        "enrolledCourses",
        "title description category price duration videoFile"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user.enrolledCourses,
                "Enrolled courses fetched successfully"
            )
        );
});

/**
 * Unenroll user from a course
 * @route DELETE /api/enrollments/:courseId
 * @access Private (requires authentication)
 */
export const unenrollFromCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user is enrolled
    const isEnrolled = user.enrolledCourses.includes(courseId);

    if (!isEnrolled) {
        throw new ApiError(400, "You are not enrolled in this course");
    }

    // Remove course from enrolledCourses array
    user.enrolledCourses = user.enrolledCourses.filter(
        (id) => id.toString() !== courseId
    );
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Successfully unenrolled from the course")
        );
});