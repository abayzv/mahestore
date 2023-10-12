import { Document } from "mongoose";

export interface IWhatsapp extends Document {
    userId: string,
    email: string,
    phoneNumber: number,
    isActivated: boolean,
    verify_code: number,
    verify_token: string
    expires_in: number
}

export interface CreateUserWhatsapp {
    userId: string,
    email: string,
    phoneNumber: number,
}

export interface VerifyWhatsapp {
    verify_code: number,
    verify_token: string,
    expires_in: number,
    isActivated: boolean
}

export interface SendMessage {
    user_id: string,
    client_id: string,
    message: string,
    sender: string
}