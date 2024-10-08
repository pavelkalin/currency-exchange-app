import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CURRENCIES,
  CURRENCIES_MAP,
  OPEN_EXCHANGE_CONTEXT,
} from '../common/constants';
import { ConversionRateDto } from '../api/dto/conversion-rate-dto';
import { ExchangeData, Rates } from './interface/exchange-data.interface';
import { calculateTTL } from './helpers/TtlToNextHour';

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
      await this.cacheService.set(CURRENCIES_MAP, data);
      return data;
    } catch (err) {
      throw new BadRequestException('Open Exchange API error', {
        cause: new Error(),
        description: 'Could not get list of currencies',
      });
    }
  }

  /**
   * Process the rates data for a specific base currency and stores it in cache with a given time-to-live (TTL).
   *
   * @param {string} baseCurrency - The base currency for which rates are being processed.
   * @param {Object} rates - The rates data to be processed and stored.
   * @param {number} timestamp - The timestamp indicating when the rates data was generated.
   *
   * @return {Promise<void>} - A promise that resolves once the processing and caching of rates data is completed.
   */
  private async processRatesData(
    baseCurrency: string,
    rates: Rates,
    timestamp: number,
  ): Promise<void> {
    const ttl = calculateTTL(timestamp);
    for (const rate of Object.keys(rates)) {
      const cacheKey = `${baseCurrency}/${rate}`;
      Logger.log(`Setting ${cacheKey} to ${rates[rate]} for ${ttl} seconds`);
      await this.cacheService.set(cacheKey, rates[rate], ttl);
    }
  }

  /**
   * Retrieve the currency conversion rate between a base currency and a target currency.
   *
   * @param {ConversionRateDto} params - The parameters for the conversion rate request.
   * @param {string} params.baseCurrency - The base currency code (default is 'USD').
   * @param {string} params.targetCurrency - The target currency code to convert to.
   * @return {Promise<number>} - A Promise that resolves to the conversion rate between the base and target currencies.
   *
   * @throws {BadRequestException} - If there is an issue with the provided currencies or if the Open Exchange API call fails.
   */
  async getCurrencyConversionRate({
    baseCurrency = 'USD',
    targetCurrency,
  }: ConversionRateDto): Promise<any> {
    const cacheKey = `${baseCurrency}/${targetCurrency}`;
    const cachedCurrencyRates = await this.cacheService.get(cacheKey);
    if (cachedCurrencyRates) {
      Logger.log(`Getting currency rates from cache`, OPEN_EXCHANGE_CONTEXT);
      return cachedCurrencyRates;
    }

    const availableTargetCurrenciesMap =
      await this.cacheService.get(CURRENCIES_MAP);
    if (
      !availableTargetCurrenciesMap[targetCurrency] ||
      !availableTargetCurrenciesMap[baseCurrency]
    ) {
      throw new BadRequestException('Wrong currency', {
        cause: new Error(),
        description: `Missing info about either currency ${baseCurrency} or currency ${targetCurrency}`,
      });
    }
    try {
      const url = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_API_KEY}&base=${baseCurrency}&prettyprint=false&show_alternative=false`;
      const {
        data: { base, rates, timestamp },
      } = (await this.httpService.axiosRef.get(url)) as {
        data: ExchangeData;
      };
      await this.processRatesData(base, rates, timestamp);
      return rates[targetCurrency] ?? 0;
    } catch (err) {
      throw new BadRequestException('Open Exchange API error', {
        cause: new Error(),
        description: `Could not get rate for pair ${cacheKey}`,
      });
    }
  }
}
