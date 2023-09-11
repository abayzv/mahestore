import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappsController } from './whatsapps.controller';
import { WhatsappsService } from './whatsapps.service';

describe('WhatsappsController', () => {
  let controller: WhatsappsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappsController],
      providers: [WhatsappsService],
    }).compile();

    controller = module.get<WhatsappsController>(WhatsappsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
