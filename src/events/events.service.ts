import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EventEntity, EventStatusEnum } from './entities/event.entity';
import { StaffMemberEntity } from './entities/staff-member.entity';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { CityEntity } from 'src/locations/entities/city.entity';
import { CountryEntity } from 'src/locations/entities/country.entity';
import { PositionEntity } from './entities/position.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventsRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
  ) {}

  saveEventStaff(
    createStaffMembersDto: CreateStaffMemberDto,
    file?: Express.Multer.File,
  ) {
    const { contractAttachment, eventId, positionId, userId, ...staffData } =
      createStaffMembersDto;
    return this.dataSource.transaction(async (manager) => {
      let staff: StaffMemberEntity | null;
      try {
        if (createStaffMembersDto.id) {
          console.log(createStaffMembersDto.id);
          staff = await manager.findOne(StaffMemberEntity, {
            where: { id: createStaffMembersDto.id },
            relations: ['user', 'event', 'position'],
          });
          if (!staff) {
            throw new BadRequestException('This staff member does not exist');
          }
          staff.dietBudget = createStaffMembersDto.dietBudget;
          staff.salary = createStaffMembersDto.salary;
          staff.position = {
            id: createStaffMembersDto.positionId,
          } as PositionEntity;
          staff.user = { id: createStaffMembersDto.userId } as UserEntity;
        } else {
          staff = await manager.findOne(StaffMemberEntity, {
            where: {
              user: { id: userId },
              position: { id: positionId },
              event: { id: eventId },
            },
            relations: ['user', 'event', 'position'],
            withDeleted: true,
          });
          if (staff?.deletedAt) {
            staff.deletedAt = null as any;
            Object.assign(staff, staffData);
          } else {
            staff = manager.create(StaffMemberEntity, {
              contractAttachment: contractAttachment,
              user: { id: userId },
              position: { id: positionId },
              event: { id: eventId },
              ...staffData,
            });
          }
        }

        //Move File
        if (file) {
          const destinationPath = `./uploads/contracts/${staff.event.id}`;
          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          const newFilePath = path.join(
            destinationPath,
            `${staff.user.id}_${staff.position.id}_contract.pdf`,
          );
          fs.renameSync(file?.path, newFilePath);
          staff.contractAttachment = newFilePath;
          console.log(`Archivo movido a: ${newFilePath}`);
        }
        const savedStaff = await manager.save(staff);
        return await manager.findOne(StaffMemberEntity, {
          where: { id: savedStaff.id },
        });
      } catch (error) {
        if (error?.code === '23503') {
          throw new BadRequestException(
            'Please check the user, position and event ids are valid',
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

  saveEventInformation(createEventDto: CreateEventDto) {
    return this.dataSource.transaction(async (manager) => {
      let event: EventEntity | null;
      if (createEventDto.id) {
        event = await this.validateEventExists(createEventDto.id);
        event.city = { id: createEventDto.cityId } as CityEntity;
        event.country = { id: createEventDto.countryId } as CountryEntity;
        event.name = createEventDto.name;
        event.venue = createEventDto.venue;
        event.startDate = createEventDto.startDate;
        event.endDate = createEventDto.endDate;
      } else {
        event = manager.create(EventEntity, {
          country: { id: createEventDto.countryId },
          city: { id: createEventDto.cityId },
          ...createEventDto,
        });
      }
      const savedEvent = await manager.save(event);
      return manager.findOne(EventEntity, {
        where: { id: savedEvent.id },
        relations: ['country', 'city'],
      });
    });
  }

  confirmEvent(eventId: number) {
    return this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id: eventId },
      });
      if (!event) {
        throw new BadRequestException(`Event with id ${eventId} not found`);
      }
      event.status = EventStatusEnum.CREATED;
      await manager.save(event);
      return manager.findOne(EventEntity, {
        where: { id: event.id },
        relations: ['country', 'city'],
      });
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
      relations: [...relations, 'city', 'country'],
    });
    if (!events?.length)
      throw new NotFoundException(`There are not events created yet.`);
    return events;
  }

  async findOne(id: number, getStaffMembers?: boolean) {
    const relations: string[] = [];
    if (getStaffMembers) {
      relations.push('staffMembers');
      relations.push('staffMembers.user');
      relations.push('staffMembers.position');
    }
    const event: EventEntity | null = await this.eventsRepository.findOne({
      where: { id },
      relations: [...relations, 'city', 'country'],
    });
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.eventsRepository.update(id, updateEventDto as any);
    return this.validateEventExists(id);
  }

  async remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const event = await manager.findOne(EventEntity, {
        where: { id },
        relations: ['staffMembers'],
      });
      if (!event) {
        throw new BadRequestException(`Event with id ${id} not found`);
      }
      if (event.staffMembers?.length) {
        await manager.softRemove(event.staffMembers);
      }
      await manager.softRemove(event);
      return { message: 'Event removed successfully' };
    });
  }

  async findStaffByEventId(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const staff = await manager.find(StaffMemberEntity, {
        where: { event: { id } },
        relations: ['event', 'position', 'user'],
      });
      return staff;
    });
  }

  async removeStaffMember(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const staff = await manager.findOne(StaffMemberEntity, {
        where: { id },
        relations: ['event'],
      });
      if (!staff) {
        throw new BadRequestException(`Staff with id ${id} not found`);
      }
      if (staff.event.startDate < new Date()) {
        throw new BadRequestException(
          `Delete staff members from events in the past is not allowed`,
        );
      }
      await manager.remove(staff);
      return { message: 'Staff removed successfully' };
    });
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
