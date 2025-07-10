import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseInterceptors, UseGuards} from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
  import { PrestamistaDto } from './prestamista.dto';
  import { PrestamistaEntity } from './prestamista.entity';
  import { PrestamistaService } from './prestamista.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
  import { Roles } from '../user/roles.decorator';
  import { Role } from '../user/role.enum';
  
  @Controller('prestamistas')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class PrestamistaController {
    constructor(private readonly prestamistaService: PrestamistaService) {}
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async findAll() {
      return await this.prestamistaService.findAll();
    }
  
    @Get(':prestamistaId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA,Role.DEUDOR, Role.ADMIN)
    async findOne(@Param('prestamistaId') prestamistaId: string) {
      return await this.prestamistaService.findOne(prestamistaId);
    }
  
    @Post()
    async create(@Body() prestamistaDto: PrestamistaDto) {
      const prestamista: PrestamistaEntity = plainToInstance(
        PrestamistaEntity,
        prestamistaDto,
      );
      return await this.prestamistaService.create(prestamista);
    }
  
    @Put(':prestamistaId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async update(
      @Param('prestamistaId') prestamistaId: string,
      @Body() prestamistaDto: PrestamistaDto,
    ) {
      const prestamista: PrestamistaEntity = plainToInstance(
        PrestamistaEntity,
        prestamistaDto,
      );
      return await this.prestamistaService.update(prestamistaId, prestamista);
    }
  
    @Delete(':prestamistaId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @HttpCode(204)
    async delete(@Param('prestamistaId') prestamistaId: string) {
      return await this.prestamistaService.delete(prestamistaId);
    }
  }
  