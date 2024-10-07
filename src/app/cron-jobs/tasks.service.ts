import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { OpenExchangeRatesService } from '../open-exchange-rates/open-exchange-rates.service';
import { CRON_CONTEXT } from '../common/constants';

@Injectable()
export class TasksService {
  constructor(
    private readonly openExchangeRatesService: OpenExchangeRatesService,
  ) {}
  @Timeout(1000)
  async getCurrencies() {
    Logger.log('Hotload currencies from Open Exchange', CRON_CONTEXT);
    return this.openExchangeRatesService.getListOfCurrencies();
  }
}
