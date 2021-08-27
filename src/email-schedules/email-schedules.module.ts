import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmailService } from '../email/email.service';
import { EmailSchedulesController } from './email-schedules.controller';
import { EmailSchedulesService } from './email-schedules.service';

@Module({
  controllers: [EmailSchedulesController],
  providers: [
    EmailSchedulesService,
    EmailService,
    { provide: 'GPS_LOGGER', useClass: Logger },
  ],
  imports: [ConfigModule],
})
export class EmailSchedulesModule {}
