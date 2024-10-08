import { IsNumber, IsString, Length } from 'class-validator';

export class ConvertCurrencyDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'Must be a valid number with 15 maximum decimal places' },
  )
  amount: number;

  @IsString({
    message: 'Base Currency must be a string and a valid code like USD',
  })
  @Length(3, 3, {
    message: 'Base Currency must be a 3 letter code',
  })
  baseCurrency: string;

  @IsString({
    message: 'Target Currency must be a string and a valid code like ILS',
  })
  @Length(3, 3, {
    message: 'Target Currency must be a 3 letter code',
  })
  targetCurrency: string;
}
