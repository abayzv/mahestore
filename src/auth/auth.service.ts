import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from '../common/error/error-exception';

@Injectable()
export class AuthService {
    baseUrl: string = this.configService.get<string>('AUTH_SERVICE_URL');

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async login(email: string, password: string) {
        const url = this.baseUrl + '/auth/login';
        const data = await this.useApi(url, 'POST', { email, password })

        return data
    }

    async me(token: string) {
        const url = this.baseUrl + '/users/me';
        const data = await this.useApiAuth(url, 'GET', {}, token)

        return data.data
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
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
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
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
                })
            )
        )

        return response

    }

}
