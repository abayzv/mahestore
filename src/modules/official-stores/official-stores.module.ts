import { Module } from '@nestjs/common';
import { OfficialStoresService } from './official-stores.service';
import { OfficialStoresController } from './official-stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OfficialStoreSchema } from './official-stores.schema';

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
    MongooseModule.forFeature([
      { name: 'OfficialStore', schema: OfficialStoreSchema },
    ])
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'OfficialStore', schema: OfficialStoreSchema },
    ])
  ],
  controllers: [OfficialStoresController],
  providers: [OfficialStoresService],
})
export class OfficialStoresModule { }
