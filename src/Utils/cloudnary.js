import { v2 as cloudinary } from "cloudinary";
import { apiError } from "./apiError.js"
import fs from "fs";



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadFile = async (localfilepath) => {
    try {
        if (!localfilepath) {
            return null;
        }

        const uploaded = await cloudinary.uploader.upload(localfilepath, { resource_type: "auto" })
        fs.unlinkSync(localfilepath);
        return uploaded;
    } catch (error) {
        if (localfilepath && fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
        }
        throw new apiError(400, "Failed to upload to cloudinary.");
    }
}

export { uploadFile }