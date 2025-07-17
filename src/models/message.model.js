import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
     },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    image: {
        type:String
    },
    msgType: {
        type: String,
        required: true,
        enum:["text","image"]
    }
}, {
    timestamps: true
})

export const Message = mongoose.model("Message", messageSchema);