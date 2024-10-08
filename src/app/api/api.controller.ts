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

  @Get('currencies')
  async getListOfCurrencies(): Promise<any> {
    return this.openExchangeRatesService.getListOfCurrencies();
  }

  @Post('convert')
  async convert(
    @Body() convertCurrencyDto: ConvertCurrencyDto,
  ): Promise<number> {
    return this.apiService.convert(convertCurrencyDto);
  }
}
