import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { OpenExchangeRatesModule } from './open-exchange-rates/open-exchange-rates.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [AppModule, CacheModule, OpenExchangeRatesModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
