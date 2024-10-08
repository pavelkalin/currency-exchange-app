import { Injectable } from '@nestjs/common';
import { OpenExchangeRatesService } from '../open-exchange-rates/open-exchange-rates.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly openExchangeRatesService: OpenExchangeRatesService,
  ) {}

  async convert({ baseCurrency, targetCurrency, amount }): Promise<number> {
    const conversionRate =
      await this.openExchangeRatesService.getCurrencyConversionRate({
        baseCurrency,
        targetCurrency,
      });
    return Math.floor(conversionRate * amount * 100) / 100;
  }
}
