import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateStaffMemberDto } from './create-staff-member.dto';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @ApiProperty()
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  venue: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffMemberDto)
  @ApiProperty()
  staffMembers?: CreateStaffMemberDto[];
}
