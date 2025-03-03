import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const eventEntity = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(eventEntity);
  }

  async findAll() {
    const events: EventEntity[] = await this.eventsRepository.find();
    if (!events?.length)
      throw new NotFoundException(`There are not events created yet.`);
    return events;
  }

  async findOne(id: number) {
    const event: EventEntity = await this.validateEventExists(id);
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.eventsRepository.update(id, updateEventDto);
    return this.validateEventExists(id);
  }

  async remove(id: number) {
    const event: EventEntity = await this.validateEventExists(id);
    return await this.eventsRepository.softRemove(event);
  }

  private async validateEventExists(id: number): Promise<EventEntity> {
    const event: EventEntity | null = await this.eventsRepository.findOneBy({
      id,
    });
    if (!event)
      throw new NotFoundException(`The event requested was not found.`);
    return event;
  }
}
