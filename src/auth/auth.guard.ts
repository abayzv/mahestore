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

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly whatsappService: WhatsappsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }

        const payload = this.jwtService.decode(token)
        request['user'] = payload;

        // check if user is active from whatsapp service
        // if request url start with auth and whatsapp skip this check
        if (request.url.startsWith('/api/v1/auth') || request.url.startsWith('/api/v1/whatsapps')) {
            return true;
        }

        const isActive = await this.whatsappService.isActive(payload['id']);
        if (!isActive) {
            throw new ResponseError(401, 'Unauthorized');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}