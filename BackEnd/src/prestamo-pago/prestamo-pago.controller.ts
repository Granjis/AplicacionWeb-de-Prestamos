/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PagoEntity } from 'src/pago/pago.entity';
import { PagoDto } from '../pago/pago.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PrestamoPagoService } from './prestamo-pago.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/user/role.enum';
import { Roles } from 'src/user/roles.decorator';

@Controller('prestamos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PrestamoPagoController {
    constructor(private readonly prestamoPagoService: PrestamoPagoService){}
    
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN,Role.DEUDOR, Role.PRESTAMISTA)
    @Post(':prestamoId/pagos/:pagoId')
    async addPagoPrestamo(@Param('prestamoId') prestamoId: string, @Param('pagoId') pagoId: string){
        return await this.prestamoPagoService.addPagoPrestamo(prestamoId, pagoId);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN,Role.DEUDOR,Role.PRESTAMISTA)
    @Get(':prestamoId/pagos/:pagoId')
    async findPagoByPrestamoIdPagoId(@Param('prestamoId') prestamoId: string, @Param('pagoId') pagoId: string){
        return await this.prestamoPagoService.findPagoByPrestamoIdPagoId(prestamoId, pagoId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN,Role.PRESTAMISTA,Role.DEUDOR)
    @Get(':prestamoId/pagos')
    async findPagosByPrestamoId(@Param('prestamoId') prestamoId: string){
        return await this.prestamoPagoService.findPagosByPrestamoId(prestamoId);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN,Role.DEUDOR, Role.PRESTAMISTA)
    @Put(':prestamoId/pagos')
    async associatePagosPrestamo(@Body() pagosDto: PagoDto[], @Param('prestamoId') prestamoId: string){
        const pagos = plainToInstance(PagoEntity, pagosDto)
        return await this.prestamoPagoService.associatePagosPrestamo(prestamoId, pagos);
    }
    
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @Delete(':prestamoId/pagos/:pagoId')
    @HttpCode(204)
    async deletePagoPrestamo(@Param('prestamoId') prestamoId: string, @Param('pagoId') pagoId: string){
        return await this.prestamoPagoService.deletePagoPrestamo(prestamoId, pagoId);
    }
}
