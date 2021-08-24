import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EmailService } from '../email/email.service';
import { CreateEmailScheduleDto } from './dto/create-email-schedule.dto';

@Injectable()
export class EmailSchedulesService {
  protected logger: LoggerService;
  constructor(
    @Inject('GPS_LOGGER') logger: LoggerService,
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.logger = logger;
  }

  scheduleEmail(emailSchedule: CreateEmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }

  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }

  findAll() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const arrayJobs = [];
    jobs.forEach((value, key) => {
      let next: string | Date;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      arrayJobs.push({ job: key, next: next });
    });
    return arrayJobs;
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM, {
    name: 'Notification',
    timeZone: 'America/Fortaleza',
  })
  handleCron() {
    this.logger.debug('É hora de ir pra casa!');
  }
}
