import mongoose from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {

        //true == single.
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        default: "Male"
    },
    refreshToken: {
        type: String
    },
    isOnline: {
        type: Boolean, default: false
    },
    code: {
        type: String
    },
    codeexpiresAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_TIME
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,
        email: this.email
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_TIME
        }
    )
}

export const User = mongoose.model("User", userSchema);