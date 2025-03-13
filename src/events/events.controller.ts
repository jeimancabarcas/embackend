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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('save/information')
  saveInformation(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.saveEventInformation(createEventDto);
  }

  @Post('save/staff')
  saveStaffMembers(@Body() createStaffMemberDto: CreateStaffMemberDto) {
    return this.eventsService.saveEventStaff(createStaffMemberDto);
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

  @Get(':id')
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
