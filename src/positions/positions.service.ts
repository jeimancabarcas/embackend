import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DataSource } from 'typeorm';
import { Position } from './entities/position.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PositionsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  create(createPositionDto: CreatePositionDto) {
    return this.dataSource.transaction(async (manager) => {
      const positionSave: Position = manager.create(
        Position,
        createPositionDto,
      );
      return await manager.save(positionSave);
    });
  }

  async findAll() {
    try {
      const positions = await this.dataSource.manager.find(Position);
      return positions;
    } catch (error) {
      throw new Error(`Error to Find Position: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.dataSource.manager.findOne(Position, {
        where: { id },
      });
    } catch (error) {
      throw new Error(`No exist Position: ${error.message}`);
    }
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.dataSource.transaction(async (manager) => {
      const position = await manager.findOne(Position, {
        where: { id },
      });
      if (position) manager.merge(Position, position, updatePositionDto);
      await manager.save(position);
      return position;
    });
  }

  remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const position = await manager.findOne(Position, {
        where: { id },
      });
      if (position) await manager.delete(Position, id);
      return `Position ${position?.name} deleted`;
    });
  }
}
