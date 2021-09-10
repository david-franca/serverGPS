import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports: [HttpModule, TerminusModule],
})
export class HealthModule {}
