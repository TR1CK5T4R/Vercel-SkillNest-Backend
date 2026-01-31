import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Course } from "../models/course.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * Create a new course with video upload
 * @route POST /api/courses
 * @access Private
 */
export const createCourse = asyncHandler(async (req, res) => {
    const { title, description, category, price, duration } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !duration) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if video file is uploaded
    if (!req.file) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload video to Cloudinary
    const videoFile = await uploadOnCloudinary(req.file.path);

    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
    }

    // Create course in database
    const course = await Course.create({
        videoFile: videoFile.url,
        title,
        description,
        category,
        price: parseFloat(price),
        duration: parseInt(duration),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, course, "Course created successfully"));
});

/**
 * Get all courses (public access)
 * @route GET /api/courses
 * @access Public
 */
export const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({});

    return res
        .status(200)
        .json(
            new ApiResponse(200, courses, "Courses fetched successfully")
        );
});

/**
 * Get a single course by ID
 * @route GET /api/courses/:id
 * @access Public
 */
export const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course fetched successfully"));
});

/**
 * Update a course by ID (Admin only)
 * @route PUT /api/courses/:id
 * @access Private/Admin
 */
export const updateCourse = asyncHandler(async (req, res) => {
    // TODO: Add admin check middleware before this controller
    // if (!req.user.isAdmin) {
    //   throw new ApiError(403, "Access denied. Admin only.");
    // }

    const { id } = req.params;
    const { title, description, category, price, duration } = req.body;

    // Find the course
    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // If new video file is uploaded, replace the old one
    if (req.file) {
        // Delete old video from Cloudinary
        const oldVideoPublicId = course.videoFile.split("/").pop().split(".")[0];
        await deleteFromCloudinary(oldVideoPublicId);

        // Upload new video
        const newVideo = await uploadOnCloudinary(req.file.path);

        if (!newVideo) {
            throw new ApiError(500, "Failed to upload new video to Cloudinary");
        }

        course.videoFile = newVideo.url;
    }

    // Update other fields if provided
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price) course.price = parseFloat(price);
    if (duration) course.duration = parseInt(duration);

    await course.save();

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course updated successfully"));
});

/**
 * Delete a course by ID (Admin only)
 * @route DELETE /api/courses/:id
 * @access Private/Admin
 */
export const deleteCourse = asyncHandler(async (req, res) => {
    // TODO: Add admin check middleware before this controller
    // if (!req.user.isAdmin) {
    //   throw new ApiError(403, "Access denied. Admin only.");
    // }

    const { id } = req.params;

    // Find the course
    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Delete video from Cloudinary
    const videoPublicId = course.videoFile.split("/").pop().split(".")[0];
    await deleteFromCloudinary(videoPublicId);

    // Delete course from database
    await Course.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Course deleted successfully"));
});