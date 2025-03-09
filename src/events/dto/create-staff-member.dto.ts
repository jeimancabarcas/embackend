import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffMemberDto {
  @IsNumber()
  @ApiProperty()
  salary: number;

  @IsNumber()
  @ApiProperty()
  dietBudget: number;

  @IsString()
  @ApiProperty()
  contractAttachment: string;

  @IsNumber()
  @ApiProperty()
  positionId: number;

  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  eventId?: number;
}
