import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { PositionsController } from './positions/positions.controller';
import { ExpensesController } from './expenses/expenses.controller';
import { FlightsController } from './flights/flights.controller';
import { HotelsController } from './hotels/hotels.controller';
import { StaffMembersController } from './staff-members/staff-members.controller';
import { ExpenseEntity } from './entities/expense.entity';
import { FlightEntity } from './entities/flight.entity';
import { HotelEntity } from './entities/hotel.entity';
import { PositionEntity } from './entities/position.entity';
import { StaffMemberEntity } from './entities/staff-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity,
      ExpenseEntity,
      FlightEntity,
      HotelEntity,
      PositionEntity,
      StaffMemberEntity,
    ]),
  ],
  controllers: [
    EventsController,
    PositionsController,
    ExpensesController,
    FlightsController,
    HotelsController,
    StaffMembersController,
  ],
  providers: [EventsService],
})
export class EventsModule {}
