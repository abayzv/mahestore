import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MediasModule } from './modules/medias/medias.module';
import { WhatsappsModule } from './modules/whatsapps/whatsapps.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    JwtModule.register({ global: true }),
    WhatsappsModule
  ],
})
export class AppModule { }
