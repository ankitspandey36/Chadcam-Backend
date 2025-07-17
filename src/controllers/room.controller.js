import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { Room } from "../models/rooms.model.js";
import { getRoomCode, createHMSRoom } from "../Utils/getRoomCode.js";
import axios from "axios"


const joinRoom = asyncHandler(async (req, res) => {
    const user = req.user;

    const { tags } = req.body;
    let preferredRoom = null;

    const allAvailableRoom = await Room.find({ tagType: { $in: tags } });
    for (const room of allAvailableRoom) {
        if (room.usersJoined.length < room.capacity) {
            preferredRoom = room;
            break;
        }
    }

    if (!preferredRoom) {
        const remainingRooms = await Room.find();
        for (const room of remainingRooms) {
            if (room.usersJoined.length < room.capacity) {
                preferredRoom = room;
                break;
            }
        }

        if (!preferredRoom) {
            const hmsRoom = await createHMSRoom();
            const hmsRoomId = hmsRoom.id;
            const role = "participants";
            const roomCode = await getRoomCode({ room_id: hmsRoomId, role });

            preferredRoom = await Room.create({
                tagType: tags,
                usersJoined: [user._id],
                hmsRoomId,
                roomCode,
                capacity: 5
            });

            return res.status(200).json(
                new apiResponse(200, preferredRoom, "Joined new room successfully")
            );
        }
    }

    const alreadyInRoom = preferredRoom.usersJoined
        .map((room) => room.toString())
        .includes(user._id.toString());

    if (!alreadyInRoom) {
        preferredRoom.usersJoined.push(user._id);
        await preferredRoom.save();
    }

    return res.status(200).json(
        new apiResponse(200, preferredRoom, "Joined room successfully")
    );
});



const leaveroom = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { roomId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({ success: false, message: "Room ID and User ID are required" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
    }
    // console.log(room);


    room.usersJoined = room.usersJoined.filter(
        (joinedUserId) => joinedUserId.toString() !== userId.toString()
    );

    if (room.usersJoined.length === 0) {

        await room.deleteOne();
        return res.status(200).json({ success: true, message: "Room deleted" });
    } else {
        await room.save();
        return res.status(200).json({ success: true, message: "User left room" });
    }
});

const getRoomMemberNumber = asyncHandler(async (req, res) => {
    const { roomId } = req.body
    if (!roomId) throw new apiError(400, "RoomId Not Found");
    const room = await Room.findById(roomId);
    if (!room) throw new apiError(400, "Room Not Found");
    const memberNumber = room.usersJoined.length;
    return res.status(200).json(new apiResponse(200, memberNumber, "Member Fetched SuccessFully"))
})



export { joinRoom, leaveroom, getRoomMemberNumber }