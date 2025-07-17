import mongoose from "mongoose";


const roomSchema = mongoose.Schema({
    tagType: [{
        type: String
    }],
    usersJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    capacity: {
        type: Number,
        default: 5
    },
    roomCode: {
        type: String
    },
    hmsRoomId: {
        type: String,
    }
}, { timestamps: true })

export const Room = mongoose.model("Room", roomSchema);