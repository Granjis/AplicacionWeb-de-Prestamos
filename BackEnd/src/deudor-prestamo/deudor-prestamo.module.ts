import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeudorEntity } from '../deudor/deudor.entity';
import { DeudorService } from '../deudor/deudor.service';
import { DeudorPrestamoController } from './deudor-prestamo.controller';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { DeudorPrestamoService } from './deudor-prestamo.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeudorEntity, PrestamoEntity])],
  providers: [DeudorService, DeudorPrestamoService],
  controllers: [DeudorPrestamoController],
})
export class DeudorPrestamoModule {}
