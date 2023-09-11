import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from '../../common/error/error-exception';
import * as FormData from 'form-data';


@Injectable()
export class MediasService {
    baseUrl: string = this.configService.get<string>('MEDIA_SERVICE_URL');

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async findAll(token: string, userId: string) {
        const url = this.baseUrl + `/medias/${userId}`;
        const data = await this.useApiAuth(url, 'GET', {}, token)

        return data.data
    }

    upload(token: string, userId: string, file: any) {
        const url = this.baseUrl + `/medias`;
        const body = new FormData();
        body.append('media', file.buffer, file.originalname);
        body.append('author', userId);

        const data = this.useApiAuth(url, 'POST', body, token)

        return data
    }

    private async useApiAuth(url: string, method: string, data: any, token: string) {
        const headers = {
            Authorization: `Bearer ${token}`
        }

        if (method === 'POST') {
            // set content type to multipart/form-data
            headers['Content-Type'] = 'multipart/form-data'
        }

        const { data: response } = await firstValueFrom(
            this.httpService.request({
                url,
                method,
                data,
                headers: headers
            }).pipe(
                catchError((error: any) => {
                    throw new ResponseError(error.response.status, error.response.data.message);
                })
            )
        )

        return response

    }

}
