import { Document } from "mongoose";

export interface IWhatsapp extends Document {
    userId: string,
    phoneNumber: number,
    isActivated: boolean,
    verify_code: number,
    verify_token: string
    expires_in: number
}

export interface CreateUserWhatsapp {
    userId: string,
    phoneNumber: number,
    isActivated: boolean,
    verify_code: number,
    verify_token: string
    expires_in: number
}

export interface VerifyWhatsapp {
    verify_code: number,
    verify_token: string
    expires_in: number
}