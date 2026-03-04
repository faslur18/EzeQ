import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@Controller('salons/:salonId/services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    async findAll(@Param('salonId') salonId: string) {
        return this.servicesService.findAll(salonId);
    }

    @Get(':id')
    async findOne(@Param('salonId') salonId: string, @Param('id') id: string) {
        return this.servicesService.findOne(salonId, id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async create(
        @Param('salonId') salonId: string,
        @CurrentUser('id') userId: string,
        @Body() dto: CreateServiceDto,
    ) {
        return this.servicesService.create(salonId, userId, dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async update(
        @Param('salonId') salonId: string,
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateServiceDto,
    ) {
        return this.servicesService.update(salonId, id, userId, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async remove(
        @Param('salonId') salonId: string,
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.servicesService.remove(salonId, id, userId);
    }
}
