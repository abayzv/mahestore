import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaSchema } from './schema/media.schema';

@Module({
  imports: [HttpModule, MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get<string>('MONGODB_URI'),
      dbName: config.get<string>('MONGODB_DB_NAME'),
    }),
  }),
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule { }
