import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from '../common/error/error-exception';
import { AxiosError } from 'axios';
import { RegisterDto } from './dto/register.dto';
import { WhatsappsService } from 'src/modules/whatsapps/whatsapps.service';
import { IWhatsapp, VerifyWhatsapp } from 'src/modules/whatsapps/interface/whatsapp.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
    url: string = this.configService.get<string>('AUTH_SERVICE_URL');
    port: string = this.configService.get<string>('AUTH_SERVICE_PORT');
    baseUrl: string = `${this.url}:${this.port}/api/v1`

    async createJwtToken(id: number, email: string, name: string, role: { id: number, name: string }) {
        const payload = { id, email, name, role }
        return await this.jwtService.signAsync(payload)
    }

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly whatsappService: WhatsappsService,
        private readonly jwtService: JwtService,
    ) { }

    async login(login: AuthLoginDto) {
        const { email, password, phoneNumber } = login

        // Check if email or phone number is in request
        if (!email && !phoneNumber) {
            throw new ResponseError(400, 'Email or phone number is required')
        }

        // Check if email or phone number is exist
        const isExist = await this.whatsappService.isExist({ email, phoneNumber })

        // If not exist, throw error
        if (!isExist) throw new ResponseError(400, 'Email or phone number not registered')

        // If exist, get email
        const { email: userEmail, isActivated } = isExist

        // Login with email
        const url = this.baseUrl + '/auth/email/login';
        const data = await this.useApi(url, 'POST', { email: userEmail, password })

        // if login with phone number, revoke access
        if (phoneNumber || !isActivated) {
            await this.whatsappService.revokeAccess(data.user.id)
        }

        // return token
        return {
            accessToken: data.token,
            refreshToken: data.refreshToken,
        }
    }

    async adminLogin(email: string, password: string) {
        const url = this.baseUrl + '/auth/admin/email/login';
        const data = await this.useApi(url, 'POST', { email, password })

        return {
            accessToken: data.token,
            refreshToken: data.refreshToken,
        }
    }

    async register(registerDto: RegisterDto) {
        const url = this.baseUrl + '/auth/email/register';
        const loginUrl = this.baseUrl + '/auth/email/login';

        const { email, password, phoneNumber } = registerDto

        const isExist = await this.whatsappService.isExist({ email, phoneNumber })
        if (isExist) throw new ResponseError(400, 'Email or phone number already registered')

        const data = await this.useApi(url, 'POST', registerDto)

        const loginData = await this.useApi(loginUrl, 'POST', {
            email: email,
            password: password
        })

        const createWhatsapp = {
            userId: loginData.user.id,
            email: email,
            phoneNumber: phoneNumber,
        }

        await this.whatsappService.create(createWhatsapp)

        return {
            accessToken: loginData.token,
            refreshToken: loginData.refreshToken,
        }
    }

    async me(token: string) {
        const url = this.baseUrl + '/auth/me';
        const data = await this.useApiAuth(url, 'GET', {}, token)

        const result = {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: data.role.id,
            roleName: data.role.name,
            status: "active",
        }

        if (data.role.id === 1) return result;

        const whatsapp = await this.whatsappService.findOne(data.id)
        if (whatsapp.isActivated) {
            result.status = "active"
        } else {
            result.status = "inactive"
        }

        return result
    }

    async verify(token: string, action: string, path: string) {
        const url = this.baseUrl + '/permissions/verify';
        const data = await this.useApiAuth(url, 'POST', { action, path }, token)

        return data
    }

    proxy(req: any) {
        const url = this.baseUrl + req.url;
        const method = req.method;
        const data = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            return this.useApiAuth(url, method, data, token)
        } else {
            return this.useApi(url, method, data)
        }
    }

    async refreshToken(token: string, refreshToken: string) {
        const url = this.baseUrl + '/auth/refresh';
        const data = await this.useApiAuth(url, 'POST', {}, refreshToken)

        return data
    }

    async revokeToken(token: string, userId: string) {
        const url = this.baseUrl + '/auth/revokeRefreshToken';
        const data = await this.useApiAuth(url, 'POST', {
            userId
        }, token)

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

    private async useApiAuth(url: string, method: string, data: any, token: string) {
        const { data: response } = await firstValueFrom(
            this.httpService.request({
                url,
                method,
                data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
