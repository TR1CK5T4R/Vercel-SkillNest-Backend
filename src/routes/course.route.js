import { Router } from "express";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js"; // TODO: Import when auth middleware is ready
// import { isAdmin } from "../middlewares/auth.middleware.js"; // TODO: Import when admin middleware is ready

const courseRouter = Router();

// Public routes
courseRouter.route("/").get(getAllCourses); // GET /api/courses - Fetch all courses
courseRouter.route("/:id").get(getCourseById); // GET /api/courses/:id - Get single course
// Protected routes (require authentication)
// TODO: Add verifyJWT middleware when ready
courseRouter
    .route("/")
    .post(
        // verifyJWT, // TODO: Uncomment when auth middleware is ready
        upload.single("videoFile"),
        createCourse
    ); // POST /api/courses - Create course

// Admin-only routes
// TODO: Add verifyJWT and isAdmin middleware when ready
courseRouter
    .route("/:id")
    .put(
        // verifyJWT, // TODO: Uncomment when auth middleware is ready
        // isAdmin, // TODO: Uncomment when admin middleware is ready
        upload.single("videoFile"),
        updateCourse
    ) // PUT /api/courses/:id - Update course
    .delete(
        // verifyJWT, // TODO: Uncomment when auth middleware is ready
        // isAdmin, // TODO: Uncomment when admin middleware is ready
        deleteCourse
    ); // DELETE /api/courses/:id - Delete course

export default courseRouter;