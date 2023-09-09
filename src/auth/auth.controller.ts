import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Request } from 'express';
import { UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptors';

@ApiTags('Auth')
@UseInterceptors(FormatResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto.email, authLoginDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.me(token);
  }
}
