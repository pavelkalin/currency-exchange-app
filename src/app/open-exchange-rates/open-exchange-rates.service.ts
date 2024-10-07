import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CURRENCIES, OPEN_EXCHANGE_CONTEXT } from '../common/constants';
import { ConversionRateDto } from '../api/dto/conversion-rate-dto';
import { Timestamp } from 'rxjs';
import { ExchangeData, Rates } from './interface/exchange-data.interface';

/**
 * Service class for interacting with the Open Exchange Rates API.
 */
@Injectable()
export class OpenExchangeRatesService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  /**
   * Retrieves a list of currencies from either the cache or the Open Exchange API.
   * If the currencies are found in the cache, they will be returned directly.
   * If not found in the cache, the method fetches the data from the Open Exchange API,
   * stores it in the cache, and returns the list of currencies.
   *
   * @return {Promise<any>} A Promise that resolves to the list of currencies in JSON format.
   * If successful, the resolved value will be the list of currencies.
   * If an error occurs during the API request, a BadRequestException will be thrown with details.
   */
  async getListOfCurrencies(): Promise<any> {
    const cachedCurrencies = await this.cacheService.get(CURRENCIES);
    if (cachedCurrencies) {
      Logger.log(`Getting currencies from cache`, OPEN_EXCHANGE_CONTEXT);
      return cachedCurrencies;
    }
    try {
      const url =
        'https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false';
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: {
          accept: 'application/json',
          app_id: process.env.OPEN_EXCHANGE_API_KEY,
        },
      });
      const currenciesArray = Object.keys(data);
      await this.cacheService.set(CURRENCIES, currenciesArray);
      return data;
    } catch (err) {
      throw new BadRequestException('Open Exchange API error', {
        cause: new Error(),
        description: 'Could not get list of currencies',
      });
    }
  }

  private async processRatesData(
    baseCurrency: string,
    rates: Rates,
    timestamp: number,
  ) {
    const TTL = 10;
    console.log(timestamp);
    for (const rate of Object.keys(rates)) {
      const cacheKey = `${baseCurrency}/${rate}`;
      await this.cacheService.set(cacheKey, rates[rate], TTL);
    }
  }

  async getCurrencyConversionRate({
    baseCurrency = 'USD',
    targetCurrency,
  }: ConversionRateDto): Promise<any> {
    const cacheKey = `${baseCurrency}/${targetCurrency}`;
    console.log(targetCurrency);
    console.log(cacheKey);
    const cachedCurrencyRates = await this.cacheService.get(cacheKey);
    if (cachedCurrencyRates) {
      Logger.log(`Getting currency rates from cache`, OPEN_EXCHANGE_CONTEXT);
      return cachedCurrencyRates;
    }
    try {
      const url = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_API_KEY}&base=${baseCurrency}&prettyprint=false&show_alternative=false`;
      const {
        data: { base, rates, timestamp },
      } = (await this.httpService.axiosRef.get(url)) as {
        data: ExchangeData;
      };
      await this.processRatesData(base, rates, timestamp);
      const cachedCurrencyRates = await this.cacheService.get(cacheKey);
      if (cachedCurrencyRates) {
        Logger.log(`Getting currency rates from cache`, OPEN_EXCHANGE_CONTEXT);
        return cachedCurrencyRates;
      }
    } catch (err) {
      throw new BadRequestException('Open Exchange API error', {
        cause: new Error(),
        description: `Could not get rate for pair ${cacheKey}`,
      });
    }
  }
}
