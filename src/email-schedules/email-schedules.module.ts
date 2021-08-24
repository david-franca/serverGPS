import { Logger, Module } from '@nestjs/common';
import { EmailSchedulesService } from './email-schedules.service';
import { EmailSchedulesController } from './email-schedules.controller';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';

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
