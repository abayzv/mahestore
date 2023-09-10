import { Controller, UseGuards, Get, Req, UseInterceptors, Post, UploadedFile } from '@nestjs/common';
import { MediasService } from './medias.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FormatResponseInterceptor } from '../../common/interceptors/format-response.interceptors';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Medias')
@UseInterceptors(FormatResponseInterceptor)
@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) { }

  @Get()
  async findAll(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = req['user'];

    return this.mediasService.findAll(token, user.userId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile('file') file, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = req['user'];

    return this.mediasService.upload(token, user.userId, file);
  }

}
