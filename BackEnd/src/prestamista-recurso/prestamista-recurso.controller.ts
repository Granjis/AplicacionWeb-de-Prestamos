import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
    UseGuards
  } from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { RecursoEntity } from 'src/recurso/recurso.entity';
  import { RecursoDto } from '../recurso/recurso.dto';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
  import { PrestamistaRecursoService } from './prestamista-recurso.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
  import { Roles } from '../user/roles.decorator';
  import { Role } from '../user/role.enum';
  
  @Controller('prestamistas')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class PrestamistaRecursoController {
    constructor(private readonly prestamistaRecursoService: PrestamistaRecursoService) {}
  
    @Post(':prestamistaId/recursos/:recursoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async addRecursoPrestamista(
      @Param('prestamistaId') prestamistaId: string,
      @Param('recursoId') recursoId: string,
    ) {
      return await this.prestamistaRecursoService.addRecursoPrestamista(prestamistaId, recursoId);
    }
  
    @Get(':prestamistaId/recursos/:recursoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findRecursoByPrestamistaIdRecursoId(
      @Param('prestamistaId') prestamistaId: string,
      @Param('recursoId') recursoId: string,
    ) {
      return await this.prestamistaRecursoService.findRecursoByPrestamistaIdRecursoId(
        prestamistaId,
        recursoId,
      );
    }
  
    @Get(':prestamistaId/recursos')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async findRecursosByPrestamistaId(@Param('prestamistaId') prestamistaId: string) {
      return await this.prestamistaRecursoService.findRecursosByPrestamistaId(prestamistaId);
    }
  
    @Put(':prestamistaId/recursos')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    async associateRecursosPrestamista(
      @Body() recursosDto: RecursoDto[],
      @Param('prestamistaId') prestamistaId: string,
    ) {
      const recursos = plainToInstance(RecursoEntity, recursosDto);
      return await this.prestamistaRecursoService.associateRecursosPrestamista(prestamistaId, recursos);
    }
  
    @Delete(':prestamistaId/recursos/:recursoId')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.PRESTAMISTA, Role.ADMIN)
    @HttpCode(204)
    async deleteRecursoPrestamista(
      @Param('prestamistaId') prestamistaId: string,
      @Param('recursoId') recursoId: string,
    ) {
      return await this.prestamistaRecursoService.deleteRecursoPrestamista(prestamistaId, recursoId);
    }
  }
  