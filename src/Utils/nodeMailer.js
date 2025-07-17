import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "chadcam132@gmail.com",
        pass: process.env.GMAIL_PASS,
    },
});

export default transporter