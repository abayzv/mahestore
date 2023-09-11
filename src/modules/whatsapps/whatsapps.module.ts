import { Module } from '@nestjs/common';
import { WhatsappsService } from './whatsapps.service';
import { WhatsappsController } from './whatsapps.controller';

@Module({
  controllers: [WhatsappsController],
  providers: [WhatsappsService],
})
export class WhatsappsModule {}
