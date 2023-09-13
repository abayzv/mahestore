import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddressSchema } from './schema/address.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('MONGODB_DB_NAME'),
      }),
    }),
    MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule { }
