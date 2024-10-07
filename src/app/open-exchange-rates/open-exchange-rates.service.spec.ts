import { Test, TestingModule } from '@nestjs/testing';
import { OpenExchangeRatesService } from './open-exchange-rates.service';

describe('OpenExchangeRatesService', () => {
  let service: OpenExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenExchangeRatesService],
    }).compile();

    service = module.get<OpenExchangeRatesService>(OpenExchangeRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
