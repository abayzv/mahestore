import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { CreateMidtranDto } from './dto/create-midtran.dto';
import { UpdateMidtranDto } from './dto/update-midtran.dto';
import { FindOneEvent } from './midtrans.events';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Midtrans')
@Controller('midtrans')
export class MidtransController {
  constructor(private readonly midtransService: MidtransService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMidtranDto: CreateMidtranDto, @Req() req: Request) {
    return this.midtransService.create(createMidtranDto, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.midtransService.findOne(id);
  }

}
