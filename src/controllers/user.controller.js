import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation- not empty
    // check if user already exists:username and emails
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation 
    // return response


    if (!req.body) {
        throw new ApiError(400, "Request body missing");
    }

    const { email, username, password } = req.body

    // console.log('email: ', email);

    if (
        !email?.trim() ||
        !username?.trim() ||
        !password?.trim()
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username")
    }

    const user = await User.create({
        email,
        password,
        username: username.toLowerCase()
    })


    // Generate tokens after creating user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Get user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user, try again");
    }

    // Return with tokens (same format as login)
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: createdUser,
                accessToken,
                refreshToken
            },
            "User registered successfully"
        )
    );
    // const createdUser = await User.findById(user._id).select("-password -refreshToken");


    // if (!createdUser) {
    //     throw new ApiError(500, "Something went wrong while creating user, try again");
    // }

    // return res.status(201).json(
    //     new ApiResponse(201, createdUser, "User registered successfully")
    // )
});

const loginUser = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body missing");
    }
    // Get email and password from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");;

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Verify password using bcrypt 
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in user document
    user.refreshToken.push(refreshToken);
    await user.save({ validateBeforeSave: false });

    // Prepare user data (exclude sensitive fields)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    );

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Send response with tokens in cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

export { registerUser, loginUser };