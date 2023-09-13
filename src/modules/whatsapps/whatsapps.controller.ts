import { Controller, Post, Req, Body, UseGuards, Get } from '@nestjs/common';
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/test')
  async test() {
    const number: number = 6285259622409
    // create order invoice here
    const message: string = `
-----------------------------------
PT MAHESA DIGITAL INDONESIA
-----------------------------------
*INVOICE*
-----------------------------------
*Order ID:* 123456789
*Order Date:* 2021-09-09
*Order Status:* Paid
*Payment Method:* Bank Transfer
*Payment Date:* 2021-09-09
*Payment Status:* Paid
*Total:* Rp. 100.000
*Payment Proof:* https://www.google.com
-----------------------------------
    `

    return this.whatsappsService.sendMessage(number, message)
  }

}
