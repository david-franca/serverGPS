import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [HealthCheckService, HealthCheckExecutor, HttpHealthIndicator],
  imports: [HttpModule],
})
export class HealthModule {}
