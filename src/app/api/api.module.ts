import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { OpenExchangeRatesService } from '../open-exchange-rates/open-exchange-rates.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ApiController],
  providers: [ApiService, OpenExchangeRatesService],
})
export class ApiModule {}
