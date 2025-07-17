import mongoose, { model } from "mongoose";

const feedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
})

export const Feedback = mongoose.model("Feedback",feedbackSchema)