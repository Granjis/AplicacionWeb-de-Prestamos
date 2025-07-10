import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PrestamoService } from './prestamo.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrestamoEntity } from './prestamo.entity';
import { PrestamoDto } from './prestamo.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('prestamo')
export class PrestamoController {
    constructor(private readonly prestamoService: PrestamoService) { }
    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findAll() {
        return await this.prestamoService.findAll();
    }

    @Get(':prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async findOne(@Param('prestamoId') prestamoId: string) {
        return await this.prestamoService.findOne(prestamoId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async create(@Body() prestamoDto: PrestamoDto) {
        const prestamo: PrestamoEntity = plainToInstance(PrestamoEntity, prestamoDto);
        return await this.prestamoService.create(prestamo);
    }

    @Put(':prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async update(@Param('prestamoId') prestamoId: string, @Body() prestamoDto: PrestamoDto) {
        const prestamo: PrestamoEntity = plainToInstance(PrestamoEntity, prestamoDto);
        return await this.prestamoService.update(prestamoId, prestamo);
    }

    @Delete(':prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    @HttpCode(204)
    async delete(@Param('prestamoId') prestamoId: string) {
        return await this.prestamoService.delete(prestamoId);
    }
}
