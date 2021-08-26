import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { StateService } from '../state/state.service';
import { PropagatorService } from './propagator.service';

@Module({
  imports: [RedisModule],
  providers: [PropagatorService, StateService],
  exports: [PropagatorService],
})
export class PropagatorModule {}
