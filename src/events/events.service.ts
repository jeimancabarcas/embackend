import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { StaffMemberEntity } from './entities/staff-member.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createEventDto: CreateEventDto) {
    const { staffMembers, ...eventData } = createEventDto;
    return this.dataSource.transaction(async (manager) => {
      try {
        const event = manager.create(EventEntity, eventData);
        const savedEvent = await manager.save(event);
        if (staffMembers?.length) {
          const staffEntities = manager.create(
            StaffMemberEntity,
            staffMembers.map((staff) => ({
              ...staff,
              event: { id: savedEvent.id },
              user: { id: staff.userId },
              position: { id: staff.positionId },
            })),
          );
          await manager.save(staffEntities);
        }
        return manager.findOne(EventEntity, {
          where: { id: savedEvent.id },
        });
      } catch (error) {
        if (error?.code === '23503') {
          throw new BadRequestException(
            'One or more users or positions do not exist. ' +
              'Please verify that all provided user IDs and position IDs are valid.',
          );
        }
        if (error?.code === '23505') {
          throw new BadRequestException(
            'Some of these staff members are already assigned to this event. ' +
              'Please ensure that no staff member has a duplicate position within the same event.',
          );
        }
        throw error;
      }
    });
  }

  async findAll(getStaffMembers?: boolean) {
    const relations: string[] = [];
    if (getStaffMembers) {
      relations.push('staffMembers');
      relations.push('staffMembers.user');
      relations.push('staffMembers.position');
    }
    const events: EventEntity[] = await this.eventsRepository.find({
      relations: relations,
    });
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
