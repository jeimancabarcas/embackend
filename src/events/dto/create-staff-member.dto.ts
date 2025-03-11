import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class CreateStaffMemberDto {
  @IsNumber()
  @ApiProperty()
  salary: number;

  @IsNumber()
  @ApiProperty()
  dietBudget: number;

  @IsDefined()
  @ApiProperty()
  contractAttachment: File;

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
