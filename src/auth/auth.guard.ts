import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'
import { ResponseError } from '../common/error/error-exception';
import { WhatsappsService } from 'src/modules/whatsapps/whatsapps.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly whatsappService: WhatsappsService,
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        console.log(token)
        if (!token) {
            console.log('token tidak ada')
            throw new UnauthorizedException('Unauthorized');
        }

        if (request.url === '/api/v1/auth/refresh-token') return true;

        // verify token
        try {
            this.jwtService.verify(token);
        } catch (error) {
            console.log("token tidak valid")
            throw new UnauthorizedException('Unauthorized');
        }

        const payload = this.jwtService.decode(token)
        request['user'] = payload;

        try {
            const me = await this.authService.me(token);
            request['user'].user = {
                email: me.email,
                firstName: me.firstName,
                lastName: me.lastName,
            }
        } catch (err) {
            console.log("user tidak ditemukan")
            throw new ResponseError(401, 'Unauthorized')
        }

        if (payload['role'].id === 1) return true;

        const skipCheck = [
            '/api/v1/auth/me',
            '/api/v1/whatsapps/verify',
            '/api/v1/whatsapps/send-otp',
        ]
        if (skipCheck.includes(request.url)) {
            return true;
        }

        const whatsapp = await this.whatsappService.isActive(payload['id']);
        if (!whatsapp.isActive) {
            console.log("whatsapp tidak aktif")
            throw new ResponseError(401, 'Unauthorized');
        } else {
            request['user'].phoneNumber = whatsapp.phoneNumber;
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}