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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
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
}
