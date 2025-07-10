import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoEntity } from '../recurso/recurso.entity';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { PrestamistaRecursoService } from './prestamista-recurso.service';
import { PrestamistaRecursoController } from './prestamista-recurso.controller';

@Module({
  providers: [PrestamistaRecursoService],
  imports: [TypeOrmModule.forFeature([PrestamistaEntity, RecursoEntity])],
  controllers: [PrestamistaRecursoController],
})
export class PrestamistaRecursoModule {}