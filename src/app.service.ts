import { Injectable } from '@nestjs/common';
import { MidtransService } from './modules/midtrans/midtrans.service';
import { AuthService } from './auth/auth.service';
import { WhatsappsService } from './modules/whatsapps/whatsapps.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseError } from './common/error/error-exception';
import { IServerStatus } from './common/interface/server.interfaces';

@Injectable()
export class AppService {

    constructor(
        private readonly midtransService: MidtransService,
        private readonly authService: AuthService,
        private readonly whatsappService: WhatsappsService,
        private readonly httpService: HttpService,
    ) { }

    humanizeTimestamp(timestamp: number): string {
        // mengubah timestamp menjadi milidetik
        const date = new Date(timestamp * 1000);
        // mendapatkan waktu sekarang sebagai milidetik
        const now = Date.now();
        // menghitung selisih waktu dalam detik
        const diff = Math.round((now - date.getTime()) / 1000);
        // menentukan satuan waktu yang sesuai
        let unit: string;
        let value: number;
        if (diff < 60) {
            // kurang dari satu menit
            unit = "second";
            value = diff;
        } else if (diff < 3600) {
            // kurang dari satu jam
            unit = "minute";
            value = Math.floor(diff / 60);
        } else if (diff < 86400) {
            // kurang dari satu hari
            unit = "hour";
            value = Math.floor(diff / 3600);
        } else if (diff < 604800) {
            // kurang dari satu minggu
            unit = "day";
            value = Math.floor(diff / 86400);
        } else if (diff < 2592000) {
            // kurang dari satu bulan
            unit = "week";
            value = Math.floor(diff / 604800);
        } else if (diff < 31536000) {
            // kurang dari satu tahun
            unit = "month";
            value = Math.floor(diff / 2592000);
        } else {
            // lebih dari satu tahun
            unit = "year";
            value = Math.floor(diff / 31536000);
        }
        // menambahkan huruf s jika nilai lebih dari satu
        if (value > 1) {
            unit += "s";
        }
        // mengembalikan format human-friendly
        return `${value} ${unit} ago`;
    }

    async getServerStatus() {
        // let status = {
        //     midtrans_services: null,
        //     auth_services: null,
        //     whatsapp_services: null,
        // }

        // try {
        //     await this.midtransService.ping();
        //     status.midtrans_services = "up";
        // } catch (error) {
        //     status.midtrans_services = "down";
        // }

        // try {
        //     await this.authService.ping();
        //     status.auth_services = "up";
        // } catch (error) {
        //     status.auth_services = "down";
        // }

        // try {
        //     await this.whatsappService.getStatus();
        //     status.whatsapp_services = "up";
        // } catch (error) {
        //     status.whatsapp_services = "down";
        // }

        const res = await this.useApi("http://localhost:2375/containers/json", "GET", null)
        const serviceList = ["abayzv/auth-service-api", "abayzv/wa-services-api:latest", "midtrans-services-api", "mongo:latest", "scraper-local-development", "redis/redis-stack:latest", "abayzv/postgres"]
        // return item only in serviceList
        const services = res.filter((item: any) => serviceList.includes(item.Image))
        const status: IServerStatus[] = services.map((item: any) => {
            return {
                name: item.Image,
                status: item.Status,
                state: item.State,
                createdAt: this.humanizeTimestamp(item.Created),
            }
        })

        return status;
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
