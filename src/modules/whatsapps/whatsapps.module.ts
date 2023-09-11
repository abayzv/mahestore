import { Module, Global } from '@nestjs/common';
import { WhatsappsService } from './whatsapps.service';
import { WhatsappsController } from './whatsapps.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsappSchema } from './schema/whatsapp.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
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
    MongooseModule.forFeature([{ name: 'Whatsapp', schema: WhatsappSchema }])
  ],
  controllers: [WhatsappsController],
  exports: [WhatsappsService],
  providers: [WhatsappsService],
})
export class WhatsappsModule { }
