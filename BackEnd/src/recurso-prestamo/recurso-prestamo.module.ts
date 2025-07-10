import { Module } from '@nestjs/common';
import { RecursoPrestamoService } from './recurso-prestamo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoEntity } from 'src/recurso/recurso.entity';
import { PrestamoEntity } from 'src/prestamo/prestamo.entity';
import { RecursoPrestamoController } from './recurso-prestamo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecursoEntity,PrestamoEntity])],
  providers: [RecursoPrestamoService],
  controllers: [RecursoPrestamoController],
})
export class RecursoPrestamoModule {}
