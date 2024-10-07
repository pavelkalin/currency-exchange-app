import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { OpenExchangeRatesService } from '../open-exchange-rates/open-exchange-rates.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly openExchangeRatesService: OpenExchangeRatesService,
  ) {}

  @Get()
  getHello(): string {
    return this.apiService.getHello();
  }

  @Get('currencies')
  async getListOfCurrencies(): Promise<any> {
    return this.openExchangeRatesService.getListOfCurrencies();
  }

  @Get('currencies-convert/:id')
  async getCurrencyConversionRate(@Param() params: any): Promise<any> {
    return this.openExchangeRatesService.getCurrencyConversionRate({
      targetCurrency: params.id,
    });
  }

  @Post('convert')
  convert(@Body() convertCurrencyDto: ConvertCurrencyDto): string {
    return this.apiService.getHello();
  }
}
