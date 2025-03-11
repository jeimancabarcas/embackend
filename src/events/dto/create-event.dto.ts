import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @ApiProperty()
  countryId: number;

  @IsNumber()
  @ApiProperty()
  cityId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffMemberDto)
  @ApiProperty()
  staffMembers?: CreateStaffMemberDto[];
}
