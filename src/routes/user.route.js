import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getUserDashboard, getCurrentUser } from "../controllers/dashboard.controller.js";
// In user.route.js
import { refreshAccessToken } from "../controllers/refreshToken.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// routes declaration
const userRouter = Router();

userRouter.post(
    "/register",
    upload.none(),
    registerUser
);//working fine
userRouter.route("/login").post(loginUser);//working fine
userRouter.route("/dashboard").get(verifyJWT, getUserDashboard);//working fine
userRouter.route("/profile").get(verifyJWT, getCurrentUser);//working fine
userRouter.route("/refresh-token").post(refreshAccessToken);//working fine
// localhost: 8001 / api / v1 / users / register
// userRouter.route("/login").post(loginUser);

export { userRouter };