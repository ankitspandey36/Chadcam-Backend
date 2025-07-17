import connectDb from "./database/index.js";
import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { Room } from "./models/rooms.model.js";

const server = createServer(app);

const PORT = process.env.PORT || 5000

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chadcam-frontend.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

io.on("connection", (socket) => {

  let currentUserId;


  socket.on("new-user-joined", (user) => {
    if (user && user._id) {
      currentUserId = user._id;
      users[socket.id] = user;
      users[user._id] = socket.id
    }

  });

  socket.on("message", (msgobj) => {
    io.emit("receive", msgobj);
  });

  socket.on("disconnect", async () => {
    if (currentUserId && users[currentUserId] === socket.id) {
      delete users[currentUserId];
    } else {
      delete users[socket.id];
    }

    try {
      const rooms = await Room.find({ usersJoined: currentUserId });

      for (const room of rooms) {
        room.usersJoined = room.usersJoined.filter(
          (joinedUserId) => joinedUserId.toString() !== currentUserId.toString()
        );

        if (room.usersJoined.length === 0) {
          await room.deleteOne();
          console.log(`Room ${room._id} deleted as it became empty.`);
        } else {
          await room.save();
          console.log(`User ${currentUserId} removed from room ${room._id}`);
        }
      }
    } catch (err) {
      console.error("Error while removing user from room on disconnect:", err);
    }
  });

});

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is bored.");
    });
  })
  .catch((err) => {
    console.error(" DB Connection Error:", err);
  });

export { io, users };
