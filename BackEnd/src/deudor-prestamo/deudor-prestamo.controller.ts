/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { DeudorPrestamoService } from './deudor-prestamo.service';
import { plainToInstance } from 'class-transformer';
import { PrestamoDto } from '../prestamo/prestamo.dto';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';

@Controller('deudor')
@UseInterceptors(BusinessErrorsInterceptor)
export class DeudorPrestamoController {
    constructor(private readonly deudorPrestamoService: DeudorPrestamoService) { }

    @Post(':deudorId/prestamos/:prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async addPrestamoDeudor(@Param('deudorId') deudorId: string, @Param('prestamoId') prestamoId: string) {
        return await this.deudorPrestamoService.addPrestamoDeudor(deudorId, prestamoId);
    }
    @Get(':deudorId/prestamos/:prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findPrestamoBydeudorIdprestamoId(@Param('deudorId') deudorId: string, @Param('prestamoId') prestamoId: string) {
        return await this.deudorPrestamoService.findPrestamoByDeudorIDPrestamoID(deudorId, prestamoId);
    }
    @Get(':deudorId/prestamos')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findprestamosBydeudorId(@Param('deudorId') deudorId: string) {
        return await this.deudorPrestamoService.findPrestamosByDeudorId(deudorId);
    }
    @Put(':deudorId/prestamos')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async associateprestamosDeudor(@Body() prestamosDto: PrestamoDto[], @Param('deudorId') deudorId: string) {
        const prestamos = plainToInstance(PrestamoEntity, prestamosDto)
        return await this.deudorPrestamoService.associatePrestamosDeudor(deudorId, prestamos);
    }
    @Put(':deudorId/prestamos/:prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async associateprestamoDeudor(@Body() prestamoDto: PrestamoDto, @Param('deudorId') deudorId: string, @Param('prestamoId') prestamoId: string) {
        const prestamo = plainToInstance(PrestamoEntity, prestamoDto)
        return await this.deudorPrestamoService.associatePrestamoDeudor(deudorId, prestamoId ,prestamo);
    }
    @Delete(':deudorId/prestamos/:prestamoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    @HttpCode(204)
    async deletePrestamoDeudor(@Param('deudorId') deudorId: string, @Param('prestamoId') prestamoId: string) {
        return await this.deudorPrestamoService.deletePrestamoDeudor(deudorId, prestamoId);
    }
    @Delete(':deudorId/prestamos')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    @HttpCode(204)
    async deletePrestamosDeudor(@Param('deudorId') deudorId: string) {
        return await this.deudorPrestamoService.deletePrestamosDeudor(deudorId);
    }
}
