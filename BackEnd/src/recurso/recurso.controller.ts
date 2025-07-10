import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecursoDto } from './recurso.dto';
import { RecursoEntity } from './recurso.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/user/roles.decorator';
import { Role } from 'src/user/role.enum';

@Controller('recursos')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecursoController {
    constructor(
        private readonly recursoService: RecursoService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async findAll() 
    {
        return await this.recursoService.findAll();
    }

    @Get(':recursoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async findOne(@Param('recursoId') recursoId: string)
    {
        return await this.recursoService.findOne(recursoId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async create(@Body()recursoDto: RecursoDto)
    {
        const recurso : RecursoEntity = plainToInstance(RecursoEntity, recursoDto)
        return await this.recursoService.create(recurso);
    }

    @Put(':recursoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async update(@Param('recursoId') recursoId: string, @Body() recursoDto: RecursoDto)
    {
        const recurso : RecursoEntity = plainToInstance(RecursoEntity, recursoDto)
        return this.recursoService.update(recursoId, recurso);
    }

    @Delete('recurso/:recursoId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async delete(@Param('recursoId') recursoId: string)
    {
        return await this.recursoService.delete(recursoId);
    }
}
