import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminSalonsService } from './admin-salons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@Controller('admin/salons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminSalonsController {
    constructor(private readonly adminSalonsService: AdminSalonsService) { }

    @Get()
    async findAll() {
        return this.adminSalonsService.findAll();
    }

    @Patch(':id')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.adminSalonsService.updateStatus(id, status);
    }
}
