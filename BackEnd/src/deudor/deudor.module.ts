import { Module } from '@nestjs/common';
import { DeudorService } from './deudor.service';
import { DeudorEntity } from './deudor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeudorController } from './deudor.controller';
import { PrestamoService } from '../prestamo/prestamo.service';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
@Module({
  providers: [DeudorService, PrestamoService, PrestamoEntity],
  imports: [TypeOrmModule.forFeature([DeudorEntity, PrestamoEntity])],
  controllers: [DeudorController],
  exports: [DeudorService],
})
export class DeudorModule {}
