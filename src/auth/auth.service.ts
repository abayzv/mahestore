import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from '../common/error/error-exception';
import { AxiosError } from 'axios';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    url: string = this.configService.get<string>('AUTH_SERVICE_URL');
    port = this.configService.get<string>('AUTH_SERVICE_PORT');
    baseUrl: string = `${this.url}:${this.port}/api/v1`

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async login(email: string, password: string) {
        const url = this.baseUrl + '/auth/email/login';
        const data = await this.useApi(url, 'POST', { email, password })

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
        const data = await this.useApi(url, 'POST', registerDto)

        return data
    }

    async me(token: string) {
        const url = this.baseUrl + '/auth/me';
        console.log(url)
        console.log(token)
        const data = await this.useApiAuth(url, 'GET', {}, token)

        return {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: data.role.id,
            roleName: data.role.name,
            status: data.status.name,
        }
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
        const url = this.baseUrl + '/auth/refreshToken';
        const data = await this.useApiAuth(url, 'POST', {
            refreshToken
        }, token)

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
