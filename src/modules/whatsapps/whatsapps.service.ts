import { Injectable } from '@nestjs/common';
import { CreateUserWhatsapp, IWhatsapp, VerifyWhatsapp } from './interface/whatsapp.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseError } from 'src/common/error/error-exception';

@Injectable()
export class WhatsappsService {
    constructor(@InjectModel('Whatsapp') private whatsappModel: Model<IWhatsapp>) { }

    verifyUser = async (userId: number, verifyCode: number, verifyToken: string) => {
        const data = await this.whatsappModel.find({
            verify_code: verifyCode,
            verify_token: verifyToken
        });

        if (data.length > 0) {
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

    async create(createUserWhatsapp: CreateUserWhatsapp): Promise<CreateUserWhatsapp> {
        const whatsapp = await this.whatsappModel.create(createUserWhatsapp);
        return whatsapp;
    }

    async findOne(userId: string): Promise<IWhatsapp> {
        return this.whatsappModel.findOne({ userId: userId }).lean();
    }

    async sendOtp(userId: string, verifyData: VerifyWhatsapp) {
        const whatsapp = await this.whatsappModel.findOneAndUpdate({ userId: userId }, verifyData).lean();
        return whatsapp;
    }
}
