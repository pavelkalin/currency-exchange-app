import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { OpenExchangeRatesModule } from './open-exchange-rates/open-exchange-rates.module';
import { ApiModule } from './api/api.module';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './cron-jobs/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    AppModule,
    OpenExchangeRatesModule,
    ApiModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
