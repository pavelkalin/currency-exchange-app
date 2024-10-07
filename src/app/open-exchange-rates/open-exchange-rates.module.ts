import { Module } from '@nestjs/common';
import { OpenExchangeRatesService } from './open-exchange-rates.service';

@Module({
  providers: [OpenExchangeRatesService]
})
export class OpenExchangeRatesModule {}
