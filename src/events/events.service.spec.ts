import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<EventEntity>;

  const mockEvent: EventEntity = {
    id: 1,
    name: 'Test Event',
    startDate: new Date(),
    endDate: new Date(),
    venue: 'Test Venue',
    country: 'Test Country',
    city: 'Test City',
  } as EventEntity;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockEvent),
    find: jest.fn().mockResolvedValue([mockEvent]),
    findOneBy: jest.fn().mockResolvedValue(mockEvent),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    softRemove: jest.fn().mockResolvedValue(mockEvent),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const dto: CreateEventDto = {
      name: 'Test Event',
      startDate: new Date(),
      endDate: new Date(),
      venue: 'Test Venue',
      country: 'Test Country',
      city: 'Test City',
    };
    expect(await service.create(dto)).toEqual(mockEvent);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });

  it('should return all events', async () => {
    expect(await service.findAll()).toEqual([mockEvent]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one event', async () => {
    expect(await service.findOne(1)).toEqual(mockEvent);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if no events exist', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    const dto: UpdateEventDto = { name: 'Updated Event' };
    expect(await service.update(1, dto)).toEqual(mockEvent);
    expect(repository.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove an event', async () => {
    expect(await service.remove(1)).toEqual(mockEvent);
    expect(repository.softRemove).toHaveBeenCalledWith(mockEvent);
  });

  it('should throw NotFoundException if event does not exist', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
