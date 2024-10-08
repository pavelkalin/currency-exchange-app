import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { OpenExchangeRatesService } from '../open-exchange-rates/open-exchange-rates.service';
import { CRON_CONTEXT } from '../common/constants';

@Injectable()
export class TasksService {
  constructor(
    private readonly openExchangeRatesService: OpenExchangeRatesService,
  ) {}

  /**
   * Retrieve a list of currencies from Open Exchange Rates.
   * This method hot loads the currencies and returns the list.
   *
   * @Timeout(1000)
   * @returns {Promise<Array<string>>} A promise that resolves with an array of currency codes.
   */
  @Timeout(1000)
  async getCurrencies() {
    Logger.log('Hotload currencies from Open Exchange', CRON_CONTEXT);
    return this.openExchangeRatesService.getListOfCurrencies();
  }
}
