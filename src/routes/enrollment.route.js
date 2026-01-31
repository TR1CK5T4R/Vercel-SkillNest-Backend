import { Router } from "express";
import {
    enrollInCourse,
    getEnrolledCourses,
    unenrollFromCourse,
} from "../controllers/enrollment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const enrolledRouter = Router();
// Get all enrolled courses for authenticated user
enrolledRouter.route("/").get(verifyJWT, getEnrolledCourses);

// Enroll in a course
enrolledRouter.route("/:courseId").post(verifyJWT, enrollInCourse);

// Unenroll from a course
enrolledRouter.route("/:courseId").delete(verifyJWT, unenrollFromCourse);

export default enrolledRouter; 