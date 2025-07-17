import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { Feedback } from "../models/feedback.model.js";

const submitfeedback = asyncHandler(async (req, res) => {
    try {
        const {feedback} = req.body
        const user = req.user
        await Feedback.create({
            user,
            feedback
        })
        return res.status(200).json(new apiResponse(200, "Feedback Received."))
    } catch (error) {
        throw new apiError(500, "Unable to submit feedback.");
    }
})

export { submitfeedback }