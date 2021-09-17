import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-subscriber.dto';

export class UpdateSubscriberDto extends PartialType(CreatePositionDto) {
  id: number;
}
