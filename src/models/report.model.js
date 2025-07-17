import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    reportedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportedfor: {
        type: String,
        enum: [
            "Inappropriate Behavior",
            "Spam or Advertising",
            "Harassment or Bullying",
            "Hate Speech",
            "Sexual or Explicit Content",
            "Impersonation",
            "Threats or Violence",
        ],
        required:true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    }
}, { timestamps: true })

export const Report = mongoose.model("Report", reportSchema)