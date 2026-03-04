import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Get()
    async findAll(@CurrentUser('id') userId: string, @CurrentUser('role') userRole: string) {
        return this.appointmentsService.findAll(userId, userRole);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.appointmentsService.findOne(id, userId, userRole);
    }

    @Post()
    async create(@CurrentUser('id') userId: string, @Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.create(userId, dto);
    }

    @Patch(':id')
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: UpdateAppointmentStatusDto,
    ) {
        return this.appointmentsService.updateStatus(id, userId, userRole, dto);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.appointmentsService.remove(id, userId, userRole);
    }
}
