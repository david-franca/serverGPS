import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBranchDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  name: string;
}
