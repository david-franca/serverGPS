import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PositionService } from '../services/position/position.service';
import { ProtocolProcessor } from './protocol.processor';
import { ProtocolService } from './protocol.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'position',
    }),
  ],
  providers: [ProtocolService, PositionService, ProtocolProcessor],
})
export class ProtocolModule {}
