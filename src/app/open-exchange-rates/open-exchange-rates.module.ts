import { Module } from '@nestjs/common';
import { OpenExchangeRatesService } from './open-exchange-rates.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OpenExchangeRatesService],
  exports: [OpenExchangeRatesService],
})
export class OpenExchangeRatesModule {}
