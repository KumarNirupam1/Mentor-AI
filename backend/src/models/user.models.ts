import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: {
            url: String,
        },
        default: {
            url: "https://www.svgviewer.dev/s/402230/avatar-default.svg"
        }
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String
    },
    personaUsage: {
        hitesh: {
            messageCount: { type: Number, default: 0 },
            cooldownUntil: { type: Date, default: null },
        },
        piyush: {
            messageCount: { type: Number, default: 0 },
            cooldownUntil: { type: Date, default: null },
        },
    },
    openaiApiKey: {
        type: String,
        select: false,
        default: null,
    },
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
};

interface IUserMethods {
    generateAccessToken(): string;
    generateRefreshToken(): string;
};

interface IUser extends mongoose.Document, IUserMethods {
    name: string;
    email: string;
    avatar: {
        url: string;
    };
    accessToken: string;
    refreshToken: string;
    personaUsage?: {
        hitesh: {
            messageCount: number;
            cooldownUntil: Date | null;
        };
        piyush: {
            messageCount: number;
            cooldownUntil: Date | null;
        };
    };
    openaiApiKey?: string | null;
};

export const User = mongoose.model<IUser>("User", userSchema);
