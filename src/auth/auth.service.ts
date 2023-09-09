import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from 'src/common/error/error-exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async login(email: string, password: string) {
        const url = this.configService.get<string>('AUTH_SERVICE_URL') + '/auth/login';

        const { data } = await firstValueFrom(
            this.httpService.post(url, { email, password }).pipe(
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
                })
            )
        )

        return data
    }

    async me(token: string) {
        const url = this.configService.get<string>('AUTH_SERVICE_URL') + '/users/me';

        const { data } = await firstValueFrom(
            this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).pipe(
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
                })
            )
        )

        return data.data
    }

    async verify(token: string, action: string, path: string) {
        const url = this.configService.get<string>('AUTH_SERVICE_URL') + '/permissions/verify';

        const { data } = await firstValueFrom(
            this.httpService.post(url, {
                action,
                path
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).pipe(
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
                })
            )
        )

        return data
    }

}
