import { Controller, Get, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseError } from './common/error/error-exception';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/server/status')
  async getServerStatus(@Body() body: { username: string, password: string }) {
    if (body.username == "administrator" && body.password == "P@ssw0rd") {
      const res = await this.appService.getServerStatus()
      return {
        message: "success",
        data: res
      }
    } else throw new ResponseError(401, "Unauthorized");
  }
}
