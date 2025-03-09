import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEvent = {
    id: 1,
    name: 'Test Event',
    startDate: new Date(),
    endDate: new Date(),
    venue: 'Test Venue',
    country: 'Test Country',
    city: 'Test City',
  };

  const mockEventsService = {
    create: jest.fn().mockImplementation((dto) => {
      return { id: 1, ...dto };
    }),
    findAll: jest.fn().mockResolvedValue([mockEvent]),
    findOne: jest.fn().mockImplementation(() => Promise.resolve(mockEvent)),
    update: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
    remove: jest.fn().mockResolvedValue({ message: 'Deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all events', async () => {
    expect(await controller.findAll()).toEqual([mockEvent]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one event', async () => {
    expect(await controller.findOne(1)).toEqual(mockEvent);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update an event', async () => {
    const dto: UpdateEventDto = { name: 'Updated Event' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove an event', async () => {
    expect(await controller.remove(1)).toEqual({
      message: 'Deleted successfully',
    });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
