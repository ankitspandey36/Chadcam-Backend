import asyncHandler from "../Utils/asyncHandler.js"
import { apiError } from "../Utils/apiError.js"
import { apiResponse } from "../Utils/apiResponse.js"
import { Message } from "../models/message.model.js"
import { uploadFile } from "../Utils/cloudnary.js"
import { io } from "../index.js"
const getMessage = asyncHandler(async (req, res) => {
    try {

        const { roomId } = req.body;
        if (!roomId) throw new apiError(400, "Room not found.")
        const messages = await Message.find({ roomId }).populate("senderId").sort({ createdAt: 1 });;
        return res.status(200).json(new apiResponse(200, messages, "Message fetched successfully."));
    } catch (error) {
        throw new apiError(500, "Unable to fetch messages.")
    }
})


const sendMessage = asyncHandler(async (req, res) => {
    try {
        const myId = req.user._id;
        const { message, roomId } = req.body;
        const img = req.file?.path

        if (!roomId || (!message && !img)) {
            throw new apiError(400, "Missing required fields.");
        }


        let imageUrl;
        if (img) {
            const response = await uploadFile(img)
            imageUrl = response.secure_url;
        }

        let msgType = imageUrl ? "image" : "text";


        const messageSaved=await Message.create({
            senderId: myId,
            message: message || "",
            roomId,
            image: imageUrl,
            msgType
        })

        return res.status(200).json(new apiResponse(200, messageSaved,"Message sent."))
    } catch (error) {
        console.error(error);
        throw new apiError(500, "Unable to send message.")
    }


})

// const imgUploadUrl = asyncHandler(async (req, res) => {
//     const file = req.file?.path;
//     if (!file) throw new apiError("Image not found for uploading.");
//     const msgImg = await uploadFile(file);
//     const imgUrl = msgImg.secure_url;
//     return res.status(200).json(new apiResponse(200, imgUrl, "Msg image uploaded succesfully."))
// })

export { getMessage, sendMessage }