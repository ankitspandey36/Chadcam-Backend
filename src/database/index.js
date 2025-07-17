import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import dotenv from 'dotenv'
dotenv.config()

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
    } catch (error) {
        console.log('DB connection attempt failed.');
        
    }
}

export default connectDb