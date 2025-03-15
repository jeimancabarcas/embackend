import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreatePositionDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description?: string;
}
