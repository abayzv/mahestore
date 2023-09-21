import { Test, TestingModule } from '@nestjs/testing';
import { OfficialStoresService } from './official-stores.service';

describe('OfficialStoresService', () => {
  let service: OfficialStoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficialStoresService],
    }).compile();

    service = module.get<OfficialStoresService>(OfficialStoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
