import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  const mockUser: UserEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    lastName: 'Doe',
    birthdate: new Date(),
    address: '123 Main St',
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    softRemove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      lastName: 'Doe',
      birthdate: '1990-01-01',
      address: '123 Main St',
    };
    expect(await service.create(dto)).toEqual(mockUser);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    expect(await service.findAll()).toEqual([mockUser]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    expect(await service.findOne(1)).toEqual(mockUser);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if no users exist', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
    await expect(service.findAll()).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated Name' };
    expect(await service.update(1, dto)).toEqual(mockUser);
    expect(repository.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a user', async () => {
    expect(await service.remove(1)).toEqual(mockUser);
    expect(repository.softRemove).toHaveBeenCalledWith(mockUser);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });
});
