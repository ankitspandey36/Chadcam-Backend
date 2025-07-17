import express from "express";

import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: ["http://localhost:5173","https://chadcam-frontend.vercel.app"],
    credentials: true
}))

app.use(express.text());

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ limit: "16kb", extended: true }))


//Routes

import userRouter from "./routes/user.routes.js";
app.use('/api/user', userRouter);

import roomRouter from "./routes/room.routes.js"
app.use('/api/room', roomRouter);

import messageRouter from "./routes/message.routes.js"
app.use('/api/message', messageRouter);

import feedbackRouter from "./routes/feedback.routes.js"
app.use('/api/feedback', feedbackRouter);

import reportRouter from "./routes/report.routes.js"
app.use('/api/report', reportRouter);

export default app;