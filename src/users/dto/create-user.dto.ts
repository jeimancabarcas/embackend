import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

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

  @IsOptional()
  @IsArray()
  @ApiProperty()
  permissions: PermissionDto[];
}

export class PermissionDto {
  id: number;
}
