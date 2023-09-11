import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokennDto } from './dto/refresh-token.dto';
import { RevokeTokennDto } from './dto/revokte-token.dto';
import { Request } from 'express';
import { UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from '../common/interceptors/format-response.interceptors';
import { RoleGuard } from './role/role.guard';
import { Roles } from './roles/roles.decorator';

@ApiTags('Auth')
@UseInterceptors(FormatResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('/login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto.email, authLoginDto.password);
  }

  @Post('/admin/login')
  async adminLogin(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.adminLogin(authLoginDto.email, authLoginDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/me')
  async me(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.me(token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokennDto, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.refreshToken(token, refreshTokenDto.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/revoke-token')
  async revokeToken(@Body() revokeTokenDto: RevokeTokennDto, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.revokeToken(token, revokeTokenDto.userId);
  }
}
