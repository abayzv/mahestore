import { Test, TestingModule } from '@nestjs/testing';
import { OfficialStoresController } from './official-stores.controller';
import { OfficialStoresService } from './official-stores.service';

describe('OfficialStoresController', () => {
  let controller: OfficialStoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficialStoresController],
      providers: [OfficialStoresService],
    }).compile();

    controller = module.get<OfficialStoresController>(OfficialStoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
