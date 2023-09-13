import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios/dist';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from '../../common/error/error-exception';
import * as FormData from 'form-data';
import { Model } from 'mongoose';
import { Media } from './schema/media.schema';


@Injectable()
export class MediasService {
    url: string = this.configService.get<string>('AUTH_SERVICE_URL');
    port: string = this.configService.get<string>('AUTH_SERVICE_PORT');
    app_url: string = this.configService.get<string>('APP_URL');
    baseUrl: string = `${this.url}:${this.port}/api/v1`

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectModel('Media') private mediaModel: Model<Media>
    ) { }

    async findAll(token: string, userId: string) {
        const url = this.baseUrl + `/medias/${userId}`;
        const data = await this.useApiAuth(url, 'GET', {}, token)

        return data.data
    }

    async findOne(id: string) {
        return await this.mediaModel.findById(id)
    }

    async upload(token: string, userId: string, file: any) {
        const url = this.baseUrl + `/files/upload`;
        const body = new FormData();
        body.append('file', file.buffer, file.originalname);

        const data = await this.useApiAuth(url, 'POST', body, token)

        // change data.path from http://localhost:3000/api/v1/files/8b43fbb1385b535c6c206.jpg to app url/assets/8b43fbb1385b535c6c206.jpg
        data.path = data.path.replace('http://localhost:3000/api/v1/files', `${this.app_url}/media-service/assets`)

        const media = await this.mediaModel.create({
            path: data.path,
        })

        return media
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
