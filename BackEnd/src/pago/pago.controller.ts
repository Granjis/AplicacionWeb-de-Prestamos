import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards  } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PagoDto } from './pago.dto';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/user/role.enum';
import { Roles } from 'src/user/roles.decorator';

@Controller('pagos')
@UseInterceptors(BusinessErrorsInterceptor)
export class PagoController {

    constructor(private readonly pagoService: PagoService) {}

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAll() {
      return await this.pagoService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN,Role.DEUDOR)
    @Get(':pagoId')
    async findOne(@Param('pagoId') pagoId: string) {
      return await this.pagoService.findOne(pagoId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.PRESTAMISTA, Role.DEUDOR)
    @Post()
    async create(@Body() pagoDto: PagoDto) {
        const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
        return await this.pagoService.create(pago);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @Put(':pagoId')
    async update(@Param('pagoId') pagoId: string, @Body() pagoDto: PagoDto) {
      const pago: PagoEntity = plainToInstance(PagoEntity, pagoDto);
      return await this.pagoService.update(pagoId, pago);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @Delete(':pagoId')
    @HttpCode(204)
    async delete(@Param('pagoId') pagoId: string) {
      return await this.pagoService.delete(pagoId);
    }


}
