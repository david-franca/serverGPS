import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CookieAuthenticationGuard } from '../api/guards/cookie-authentication.guard';
import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';
import { EmailSchedulesService } from './email-schedules.service';

@Controller('email-scheduling')
export class EmailSchedulesController {
  constructor(private readonly emailSchedulesService: EmailSchedulesService) {}

  @Post('schedule')
  @UseGuards(CookieAuthenticationGuard)
  create(@Body() createEmailScheduleDto: CreateEmailScheduleDto) {
    return this.emailSchedulesService.scheduleEmail(createEmailScheduleDto);
  }

  @Post('cancel')
  @UseGuards(CookieAuthenticationGuard)
  cancel() {
    return this.emailSchedulesService.cancelAllScheduledEmails();
  }

  @Get('jobs')
  @UseGuards(CookieAuthenticationGuard)
  findAll() {
    return this.emailSchedulesService.findAll();
  }
}
