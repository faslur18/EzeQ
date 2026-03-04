import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    async updateRole(
        @Param('id') id: string,
        @CurrentUser('id') currentUserId: string,
        @Body('role') role: string,
    ) {
        return this.usersService.updateRole(id, currentUserId, role);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
        return this.usersService.remove(id, currentUserId);
    }
}
