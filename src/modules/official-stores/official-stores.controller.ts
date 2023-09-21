import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { OfficialStoresService } from './official-stores.service';
import { CreateOfficialStoreDto } from './dto/create-official-store.dto';
import { UpdateOfficialStoreDto } from './dto/update-official-store.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptors';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiBearerAuth()
@UseInterceptors(FormatResponseInterceptor)
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Official Stores')
@Controller('official-stores')
export class OfficialStoresController {
  constructor(private readonly officialStoresService: OfficialStoresService) { }

  @Roles('Admin')
  @Post()
  create(@Body() createOfficialStoreDto: CreateOfficialStoreDto) {
    return this.officialStoresService.create(createOfficialStoreDto);
  }

  @Get()
  findAll() {
    return this.officialStoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.officialStoresService.findOne(id, req);
  }

  @Roles('User')
  @Post('/follow/:id')
  follow(@Param('id') id: string, @Req() req: Request) {
    return this.officialStoresService.follow(id, req);
  }

  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfficialStoreDto: UpdateOfficialStoreDto) {
    return this.officialStoresService.update(id, updateOfficialStoreDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officialStoresService.remove(id);
  }
}
