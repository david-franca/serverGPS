import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';
import { EmailSchedulesService } from './email-schedules.service';

@Controller('email-scheduling')
export class EmailSchedulesController {
  constructor(private readonly emailSchedulesService: EmailSchedulesService) {}

  @Post('schedule')
  create(@Body() createEmailScheduleDto: CreateEmailScheduleDto) {
    return this.emailSchedulesService.scheduleEmail(createEmailScheduleDto);
  }

  @Post('cancel')
  cancel() {
    return this.emailSchedulesService.cancelAllScheduledEmails();
  }

  @Get('jobs')
  findAll() {
    return this.emailSchedulesService.findAll();
  }
}
