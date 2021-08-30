import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailSchedulesController } from './email-schedules.controller';
import { EmailSchedulesService } from './email-schedules.service';

@Module({
  controllers: [EmailSchedulesController],
  providers: [EmailSchedulesService],
  imports: [ConfigModule],
})
export class EmailSchedulesModule {}
