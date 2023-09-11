import { Injectable } from '@nestjs/common';
import { CreateUserWhatsapp, IWhatsapp, SendMessage, VerifyWhatsapp } from './interface/whatsapp.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseError } from 'src/common/error/error-exception';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappsService {
    url = this.configService.get<string>('WHATSAPP_SERVICE_URL');
    port = this.configService.get<string>('WHATSAPP_SERVICE_PORT');
    userId = this.configService.get<string>('WHATSAPP_USER_ID');
    clientId = this.configService.get<string>('WHATSAPP_CLIENT_ID');
    baseUrl: string = `${this.url}:${this.port}/api`
    expires_in: number = this.configService.get<number>('WHATSAPP_EXPIRES_IN');

    // generate 6 random number
    generateVerificationCode(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

    generateRandomToken(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
        }

        return token;
    }

    expiresIn(duration: number) {
        // duration in minutes
        const date = Date.now()
        const expires = new Date(date + duration * 60000)
        return expires.getTime()
    }

    expiredIn = (expired: number) => {
        const now = Date.now()
        const seconds = Math.floor((expired - now) / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minutes and ${remainingSeconds} seconds`;
    }

    constructor(
        @InjectModel('Whatsapp') private whatsappModel: Model<IWhatsapp>,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) { }

    verifyOtp = async (userId: number, verifyCode: number, verifyToken: string) => {
        const data = await this.whatsappModel.findOne({
            verify_code: verifyCode,
            verify_token: verifyToken
        });

        // check is expired
        const now = Date.now()
        const expired = data.expires_in

        if (now > expired) {
            throw new ResponseError(400, `Your verification code is expired, please send otp again`);
        }

        if (data) {
            await this.whatsappModel.findOneAndUpdate({
                verify_code: verifyCode,
                verify_token: verifyToken
            },
                {
                    userId: userId,
                    isActivated: true,
                    verify_code: null,
                    verify_token: null
                });
            return true;
        } else {
            throw new ResponseError(401, 'Invalid verification code');
        }
    }

    isActive = async (userId: string) => {
        const whatsapp = await this.whatsappModel.findOne({ userId: userId }).lean();
        return whatsapp.isActivated;
    }

    async create(createUserWhatsapp: CreateUserWhatsapp): Promise<CreateUserWhatsapp> {
        const whatsapp = await this.whatsappModel.create(createUserWhatsapp);
        return whatsapp;
    }

    async findOne(userId: string): Promise<IWhatsapp> {
        return this.whatsappModel.findOne({ userId: userId }).lean();
    }

    async sendOtp(userId: string) {
        const verifyToken = this.generateRandomToken(64)
        const expires_in = this.expiresIn(this.expires_in)

        const whatsapp = await this.whatsappModel.findOne({ userId: userId }).lean();
        const verifyData: VerifyWhatsapp = {
            verify_code: this.generateVerificationCode(),
            verify_token: verifyToken,
            expires_in: expires_in,
            isActivated: false
        }

        if (whatsapp && whatsapp.verify_token && whatsapp.verify_code) {
            const now = Date.now()
            const expired = whatsapp.expires_in

            if (now < expired) {
                throw new ResponseError(400, `Please wait, you can send otp again in ${this.expiredIn(expired)}`);
            }
        }
        await this.whatsappModel.findOneAndUpdate({ userId: userId }, verifyData).lean();
        await this.sendMessage(whatsapp.phoneNumber, `Your verification code is ${verifyData.verify_code}`)

        return {
            verifyToken: verifyToken,
            expiresIn: expires_in
        }
    }

    async sendMessage(number: number, message: string) {
        const url = this.baseUrl + '/send-message';
        const sendTo = number + '@c.us'

        const dataMessage: SendMessage = {
            user_id: this.userId,
            client_id: this.clientId,
            message: message,
            sender: sendTo
        }

        const data = await this.useApi(url, 'POST', dataMessage)
        return data
    }

    private async useApi(url: string, method: string, data: any) {
        const { data: response } = await firstValueFrom(
            this.httpService.request({
                url,
                method,
                data,
            }).pipe(
                catchError((error) => {
                    if (error.response.status === 422) {
                        throw new ResponseError(error.response.data.status, error.message)
                    }
                    throw new Error(error.message)
                })
            )
        )
        return response
    }
}
