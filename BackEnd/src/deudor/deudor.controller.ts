import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DeudorService } from './deudor.service';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { DeudorEntity } from './deudor.entity';
import { DeudorDto } from './deudor.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('deudor')
export class DeudorController {
    constructor(private readonly deudorService: DeudorService,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findAll() {
        return await this.deudorService.findAll();
    }

    @Get(':deudorId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findOne(@Param('deudorId') deudorId: string) {
        const deudor: DeudorEntity = await this.deudorService.findOne(deudorId);
        const deudaTotal: number = await this.deudorService.calcularDeudaTotal(deudorId);
        return { ...deudor, deudaTotal };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.ADMIN)
    async create(@Body() deudorDto: DeudorDto) {
        const deudor: DeudorEntity = plainToInstance(DeudorEntity, deudorDto);
        return await this.deudorService.create(deudor);
    }

    @Put(':deudorId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async update(@Param('deudorId') deudorId: string, @Body() deudorDto: DeudorDto) {
        const deudor: DeudorEntity = plainToInstance(DeudorEntity, deudorDto);
        return await this.deudorService.update(deudorId, deudor);
    }

    @Delete(':deudorId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    @HttpCode(204)
    async delete(@Param('deudorId') deudorId: string) {
        return await this.deudorService.delete(deudorId);
    }
}
