import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadFile } from "../Utils/cloudnary.js";
import path from "path";
import jwt from "jsonwebtoken";
import { verificationEmail } from "../Utils/sendEmail.js";
import { getCachedTopics } from "../Utils/fetchTrending.js"



const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(400, "Token generation unsuccessful.")
    }
}


const register = asyncHandler(async (req, res) => {




    let { email, password, dob, isSingle, gender } = req.body;
    let avatar = req.file?.path;
    isSingle = isSingle === "true";
    gender = gender === "true";

    if ([email, password].some((field) => field?.trim() == "") || !dob) {
        throw new apiError(400, "Field Can't be Empty while Signing Up.");
    }

    if (typeof isSingle !== "boolean" || typeof gender !== "boolean") {
        throw new apiError(400, "Invalid Boolean Fields.");
    }

    const genderString = gender ? "Female" : "Male";

    const existing = await User.findOne({
        email
    })

    if (existing && existing.isVerified) throw new apiError(409, "User already exists.");


    if (existing && !existing.isVerified) {
        await User.deleteOne({ email });
    }

    if (!avatar) {
        avatar = { secure_url: process.env.DEFAULT_IMAGE }

    }
    else {
        avatar = await uploadFile(avatar);
    }

    const vcode = Math.floor(100000 + Math.random() * 900000).toString();


    const user = await User.create({
        email,
        password,
        birthdate: dob,
        status: isSingle,
        gender: genderString,
        avatar: avatar.secure_url,
        code: vcode,
        codeexpiresAt: Date.now() + 10 * 60 * 1000,
        isVerified: false
    });

    if (!user) {
        throw new apiError(404, "Unable to create new user. Retry")
    }

    await verificationEmail(email, vcode);

    return res.status(201).json(
        new apiResponse(200, { ...user.toObject(), password: undefined }, "Registered successfully")
    )



})


const login = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new apiError(400, "Missing login details.");
    }

    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() == "")) {
        throw new apiError(400, "Details Missing for Login.");
    }
    const user = await User.findOne({ email });
    if (!user) throw new apiError(400, "User not registered.");

    const isPassCorrect = await user.checkPassword(password);
    if (!isPassCorrect) throw new apiError(400, "Incorrect Password.");

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    user.isOnline = true;
    await user.save({ validateBeforeSave: false })

    res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).status(200).json(new apiResponse(200, { user: loggedInUser, accessToken }, "Logged In Successfully"))
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
    }, { new: true })
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }
    res.clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .status(200)
        .json(new apiResponse(200, null, "Logged out successfully."));
})

const refresh = asyncHandler(async (req, res) => {
    const check = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!check) {
        return res.status(401).json({ success: false, message: "No refresh token. Please login again." });
    }
    const decode = await jwt.verify(check, process.env.REFRESH_TOKEN_SECRET);


    const user = await User.findById(decode._id);
    if (!user) throw new apiError(400, "Can't refresh please login again");

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    const option = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(new apiResponse(200, { accessToken, refreshToken }, "acces token refreshed"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { password, newPassword } = req.body
    const user = req.user;
    const isPassCorrect = await user.checkPassword(password);
    if (!isPassCorrect) throw new apiError(400, "Incorrect password for password change.")
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new apiResponse(200, {}, "Password Changed"));

})

const updateDetails = asyncHandler(async (req, res) => {
    const { email, dob, isSingle, gender } = req.body;
    if (email === undefined && dob === undefined && typeof isSingle !== "boolean" && typeof gender !== "boolean"
    ) {
        throw new apiError(400, "No field to update.");
    }


    const update = {}
    if (email) update.email = email
    if (dob) update.birthdate = dob
    if (typeof isSingle === "boolean") update.status = isSingle
    if (typeof gender === "boolean") update.gender = gender ? "Male" : "Female"

    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: update
    }, { new: true }).select("-password -refreshToken")

    return res.status(200).json(new apiResponse(200, user, "User details updated successfully."));

})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) apiError(400, "User not found.");
    res.status(200).json(new apiResponse(200, user, "Profile fetched"));
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    return res.status(200).json(new apiResponse(200, users, "Users fetched"));
})

const verifyCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body
    const user = await User.findOne({ email });
    if (!user) throw new apiError(400, "Registration Not Completed.")
    if (user.codeexpiresAt < Date.now()) {
        await User.deleteOne({ email });
        throw new apiError(400, "Code expired. Please register again.");
    }
    const checkcode = user.code;
    if (checkcode != code) throw new apiError(400, "Invalid Code.")
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new apiResponse(200, "Code Verified."));
})

const resendCode = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email });
    if (!user) throw new apiError(400, "User Not Found")
    const vcode = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = vcode;
    await user.save({ validateBeforeSave: false });
    await verificationEmail(email, vcode);
    return res.status(200).json(new apiResponse(200, "Verified Code Sent."));

})

const forgotpasswordVerification = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email }).select("-password -refreshToken");
    if (!user) throw new apiError(400, "User not found");
    const vcode = Math.floor(100000 + Math.random() * 900000).toString();
    user.code = vcode;
    user.codeexpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    await verificationEmail(email, vcode);
    return res.status(200).json(new apiResponse(200, "Verified Code Sent."));
})


const forgotpasswordchange = asyncHandler(async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body
    if (newPassword != confirmPassword) throw new apiError(400, "New and confirm password doesn't match")
    const user = await User.findOne({ email });
    if (!user) throw new apiError(400, "User not found.");
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new apiResponse(200, "Password Changed Successfully."));
})

const verifyForgotCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body
    const user = await User.findOne({ email });
    if (!user) throw new apiError(400, "User not found.")
    if (user.codeexpiresAt < Date.now()) {

        throw new apiError(400, "Code expired. Please register again.");
    }
    const checkcode = user.code;
    if (checkcode != code) throw new apiError(400, "Invalid Code.")

    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new apiResponse(200, "Code Verified."));
})

const getTrendingTopics = asyncHandler(async (req, res) => {
    const trending = getCachedTopics();
    res.status(200).json({
        success: true,
        topics: trending,
    });
})

export { login, register, logout, refresh, changePassword, updateDetails, getCurrentUser, getAllUsers, verifyCode, resendCode, forgotpasswordVerification, forgotpasswordchange, verifyForgotCode, getTrendingTopics }