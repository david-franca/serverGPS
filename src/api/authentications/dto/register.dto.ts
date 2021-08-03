import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  role: string;
}
