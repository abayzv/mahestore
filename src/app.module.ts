import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MediasModule } from './modules/medias/medias.module';
import { WhatsappsModule } from './modules/whatsapps/whatsapps.module';
import { MidtransModule } from './modules/midtrans/midtrans.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CartsModule } from './modules/carts/carts.module';
import { OfficialStoresModule } from './modules/official-stores/official-stores.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRES_IN } }),
    WhatsappsModule,
    MidtransModule,
    OrdersModule,
    AddressesModule,
    MediasModule,
    CartsModule,
    OfficialStoresModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
})
export class AppModule { }
