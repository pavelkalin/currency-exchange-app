export interface Rates {
  [key: string]: number;
}

export interface ExchangeData {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Rates;
}
