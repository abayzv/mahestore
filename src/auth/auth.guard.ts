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
        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }

        // verify token
        try {
            this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }

        const payload = this.jwtService.decode(token)
        request['user'] = payload;

        if (payload['role'].id === 1) return true;

        const skipCheck = [
            '/api/v1/auth/me',
            '/api/v1/auth/refresh',
            '/api/v1/whatsapps/verify',
            '/api/v1/whatsapps/send-otp',
        ]
        if (skipCheck.includes(request.url)) {
            return true;
        }

        const whatsapp = await this.whatsappService.isActive(payload['id']);
        if (!whatsapp.isActive) {
            throw new ResponseError(401, 'Unauthorized');
        } else {
            request['user'].phoneNumber = whatsapp.phoneNumber;
        }


        try {
            const me = await this.authService.me(token);
            request['user'].user = me;
        } catch (err) {
            throw new ResponseError(401, 'Unauthorized')
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}