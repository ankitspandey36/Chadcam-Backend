import asyncHandler from "../Utils/asyncHandler.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { Report } from "../models/report.model.js";
import { Room } from "../models/rooms.model.js";
import { io, users } from "../index.js"

const handleReport = asyncHandler(async (req, res) => {
    const user = req.user;
    const { reportedTo, reportedfor, roomId } = req.body;
    if (!reportedTo || !reportedfor || !roomId) {
        throw new apiError(400, "Both 'reportedTo' and 'reportedfor' are required.");
    }

    const alreadyReported = await Report.findOne({ reportedBy: user._id, reportedTo, roomId });
    if (alreadyReported) {
        throw new apiError(409, "You have already reported this user in this room.");
    }


    await Report.create({
        reportedBy: user._id,
        reportedTo,
        reportedfor,
        roomId
    })

    const uniqueReport = await Report.distinct("reportedBy", {
        reportedTo,
        roomId
    });

    const reportCount = uniqueReport.length;


    const room = await Room.findById(roomId);

    if (!room) {
        throw new apiError(404, "Room not found");
    }

    if (reportCount > room.usersJoined.length / 2) {
        
        const socketId = users[reportedTo];

        console.log("SocketId for reported user:", socketId);

        if (socketId) {
            io.to(socketId).emit("force-disconnect", { message: "You have been removed due to multiple reports." });
        }
        return res.status(200).json(new apiResponse(200, "User left room"));
    }



    return res.status(200).json(new apiResponse(200, "Report Successful."))

})

export { handleReport }