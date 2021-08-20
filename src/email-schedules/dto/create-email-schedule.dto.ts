import { IsEmail, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateEmailScheduleDto {
  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
