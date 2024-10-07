import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { OpenExchangeRatesModule } from '../open-exchange-rates/open-exchange-rates.module';

@Module({
  imports: [OpenExchangeRatesModule],
  providers: [TasksService],
})
export class TasksModule {}
