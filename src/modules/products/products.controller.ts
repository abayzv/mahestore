import { Controller, Get, Post, Body, Patch, Param, Delete, SerializeOptions, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../common/interceptors/format-response.interceptors';
import { PRODUCT_SINGLE, PRODUCT_LIST } from './entities/product.entity';
import { AuthGuard } from '../../auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';

@ApiBearerAuth()
@ApiTags('Products')
@UseInterceptors(FormatResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard, RoleGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Roles('Admin')
  @Post()
  @SerializeOptions({
    groups: [PRODUCT_SINGLE]
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @SerializeOptions({
    groups: [PRODUCT_LIST]
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @SerializeOptions({
    groups: [PRODUCT_SINGLE]
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  @SerializeOptions({
    groups: [PRODUCT_SINGLE]
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
