import { Module } from '@nestjs/common';
import { AdminSalonsController } from './admin-salons.controller';
import { AdminSalonsService } from './admin-salons.service';

@Module({
    controllers: [AdminSalonsController],
    providers: [AdminSalonsService],
})
export class AdminSalonsModule { }
