import { apiError } from "./apiError.js";
import transporter from "./nodeMailer.js"


const verificationEmail = async (email,code) => {
    try {
        const info = await transporter.sendMail({
            from: '"Chadcam" <chadcam132@gmail.com>',
            to: email,
            subject: "Verification code for Chadcam",
            text: "Verify Your email",
            html: code,
        });
    
        console.log("Message sent:", info.messageId);
    } catch (error) {
        throw new apiError(500, "Unable to send Verification Code");
    }
};

export {verificationEmail};