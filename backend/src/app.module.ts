import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SalonsModule } from './salons/salons.module';
import { ServicesModule } from './services/services.module';
import { HoursModule } from './hours/hours.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';
import { AdminSalonsModule } from './admin-salons/admin-salons.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    SalonsModule,
    ServicesModule,
    HoursModule,
    AppointmentsModule,
    UsersModule,
    AdminSalonsModule,
  ],
})
export class AppModule { }
