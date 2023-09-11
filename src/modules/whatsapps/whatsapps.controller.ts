import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';
import { WhatsappsService } from './whatsapps.service';
import { Request } from 'express';
import { VerifyDto } from './dto/verify.dto';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Whatsapp')
@Controller('whatsapps')
export class WhatsappsController {
  constructor(private readonly whatsappsService: WhatsappsService) {
  }

  @ApiBearerAuth()
  @Post('verify')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('User')
  async verifyOtp(@Body() verifyDto: VerifyDto, @Req() req: Request) {
    const userId = req['user'].id
    await this.whatsappsService.verifyOtp(userId, verifyDto.verify_code, verifyDto.verify_token);
    return {
      message: 'success'
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Post('/send-otp')
  async sendOtp(@Req() req: Request) {
    const userId = req['user'].id
    return this.whatsappsService.sendOtp(userId);
  }
}
