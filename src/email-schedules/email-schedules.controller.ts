import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { EmailSchedulesService } from './email-schedules.service';
import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';
import { JwtAuthenticationGuard } from '../api/guards/jwt-authentication.guard';

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
