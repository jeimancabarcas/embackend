import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {

    @IsNumber()
    @ApiProperty()
    fk_roleId?: number

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
    last_name: string;

    @IsDateString()
    @ApiProperty()
    birthdate: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsDateString()
    @ApiProperty()
    createdAt?: Date;

    @IsDateString()
    @ApiProperty()
    updatedAt?: Date;

    @IsDateString()
    @ApiProperty()
    deletedAt?: Date;
}