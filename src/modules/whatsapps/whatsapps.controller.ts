import { Controller } from '@nestjs/common';
import { WhatsappsService } from './whatsapps.service';

@Controller('whatsapps')
export class WhatsappsController {
  constructor(private readonly whatsappsService: WhatsappsService) {}
}
