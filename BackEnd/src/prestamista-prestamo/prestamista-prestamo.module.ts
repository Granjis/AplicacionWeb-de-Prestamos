import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { PrestamistaPrestamoService } from './prestamista-prestamo.service';
import { PrestamistaPrestamoController } from './prestamista-prestamo.controller';
import { DeudorEntity } from '../deudor/deudor.entity';
import { PrestamoService } from '../prestamo/prestamo.service';

@Module({
  providers: [PrestamistaPrestamoService, PrestamoService],
  imports: [TypeOrmModule.forFeature([PrestamistaEntity, PrestamoEntity, DeudorEntity])],
  controllers: [PrestamistaPrestamoController],
})
export class PrestamistaPrestamoModule {}