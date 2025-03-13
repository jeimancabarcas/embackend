import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseBoolPipe,
  Query,
  DefaultValuePipe,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('save/information')
  saveInformation(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.saveEventInformation(createEventDto);
  }

  @Post('save/staff')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (req, file, cb) => {
          cb(null, extname(file.originalname));
        },
      }),
    }),
  )
  saveStaffMembers(
    @Body() createStaffMemberDto: CreateStaffMemberDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.eventsService.saveEventStaff(createStaffMemberDto, file);
  }

  @Post('confirm/:id')
  confirmEvent(@Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.confirmEvent(eventId);
  }

  @Get()
  findAll(
    @Query('getStaffMembers', new DefaultValuePipe(false), ParseBoolPipe)
    getStaffMembers: boolean,
  ) {
    return this.eventsService.findAll(getStaffMembers);
  }

  @Get('staff/find/:id')
  findStaffMembersByEventId(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findStaffByEventId(id);
  }

  @Get('find/:id')
  findOne(
    @Query('getStaffMembers', new DefaultValuePipe(false), ParseBoolPipe)
    getStaffMembers: boolean,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.eventsService.findOne(id, getStaffMembers);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }

  @Delete('staff/:id')
  removeStaff(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.removeStaffMember(id);
  }
}
