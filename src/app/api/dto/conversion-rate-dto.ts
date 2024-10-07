import { IsString } from 'class-validator';

export class ConversionRateDto {
  @IsString()
  baseCurrency?: string;

  @IsString()
  targetCurrency: string;
}
