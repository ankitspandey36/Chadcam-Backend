import server from "./app.js";
import { Server } from "socket.io";

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

io.on("connection", (socket) => {
    console.log("User Connected");
    socket.on("disconnect", () => { })
})

export { io }