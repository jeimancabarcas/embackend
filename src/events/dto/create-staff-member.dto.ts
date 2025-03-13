import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateStaffMemberDto {
  @IsOptional()
  @ApiProperty()
  id: number;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  dietBudget: number;

  @IsOptional()
  @ApiProperty()
  contractAttachment: string;

  @ApiProperty()
  positionId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  eventId: number;
}
