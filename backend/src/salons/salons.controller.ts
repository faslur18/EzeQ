import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { CreateSalonDto, UpdateSalonDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@Controller('salons')
export class SalonsController {
    constructor(private readonly salonsService: SalonsService) { }

    @Get()
    async findAll() {
        return this.salonsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.salonsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async create(@CurrentUser('id') userId: string, @Body() dto: CreateSalonDto) {
        return this.salonsService.create(userId, dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN')
    async update(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateSalonDto,
    ) {
        return this.salonsService.update(id, userId, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SALON_ADMIN', 'SUPER_ADMIN')
    async remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.salonsService.remove(id, userId, userRole);
    }
}
