import { ErrorsInterceptor } from '@common';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';
import { EmailSchedulesService } from './email-schedules.service';

@ApiCookieAuth()
@ApiTags('emails')
@UseInterceptors(ErrorsInterceptor)
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
