import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthenticationGuard } from '../api/guards/jwt-authentication.guard';
import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';
import { EmailSchedulesService } from './email-schedules.service';

@Controller('email-scheduling')
export class EmailSchedulesController {
  constructor(private readonly emailSchedulesService: EmailSchedulesService) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createEmailScheduleDto: CreateEmailScheduleDto) {
    return this.emailSchedulesService.scheduleEmail(createEmailScheduleDto);
  }

  @Post('cancel')
  @UseGuards(JwtAuthenticationGuard)
  cancel() {
    return this.emailSchedulesService.cancelAllScheduledEmails();
  }

  @Get('jobs')
  @UseGuards(JwtAuthenticationGuard)
  findAll() {
    return this.emailSchedulesService.findAll();
  }
}
