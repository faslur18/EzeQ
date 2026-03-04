import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { HoursService } from './hours.service';
import { SetHoursDto, UpdateHourDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@Controller('salons/:salonId/hours')
export class HoursController {
    constructor(private readonly hoursService: HoursService) { }

    @Get()
    async findAll(@Param('salonId') salonId: string) {
        return this.hoursService.findAll(salonId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async setAll(
        @Param('salonId') salonId: string,
        @CurrentUser('id') userId: string,
        @Body() dto: SetHoursDto,
    ) {
        return this.hoursService.setAll(salonId, userId, dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async update(
        @Param('salonId') salonId: string,
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateHourDto,
    ) {
        return this.hoursService.update(salonId, id, userId, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async remove(
        @Param('salonId') salonId: string,
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.hoursService.remove(salonId, id, userId);
    }
}
