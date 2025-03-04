import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsDateString()
  @ApiProperty()
  birthdate: string;

  @IsString()
  @ApiProperty()
  address: string;
}
