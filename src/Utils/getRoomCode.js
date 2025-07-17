
import axios from "axios";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";



const createHMSRoom = async () => {
    const token = process.env.CAM_MANAGEMENT_TOKEN;
    const response = await axios.post(
        "https://api.100ms.live/v2/rooms",
        {
            name: `room-${uuid()}`,
            description: "Auto-created room for user group",
            template_id: process.env.TEMPLATE_ID
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
};

const getRoomCode = async ({ room_id, role }) => {
    const token = process.env.CAM_MANAGEMENT_TOKEN;
    const response = await axios.post(
        `https://api.100ms.live/v2/room-codes/room/${room_id}`,
        { role },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.data[0].code;
};

export { getRoomCode, createHMSRoom }