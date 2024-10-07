import { IsNumber, IsString } from 'class-validator';

export class ConvertCurrencyDto {
  @IsNumber()
  amount: number;

  @IsString()
  currencyFrom: string;

  @IsString()
  currencyTo: string;
}
