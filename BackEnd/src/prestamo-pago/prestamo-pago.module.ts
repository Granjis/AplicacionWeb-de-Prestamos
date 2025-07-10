import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoEntity } from 'src/pago/pago.entity';
import { PrestamoEntity } from 'src/prestamo/prestamo.entity';
import { PrestamoPagoService } from './prestamo-pago.service';
import { PrestamoPagoController } from './prestamo-pago.controller';

@Module({
  providers: [PrestamoPagoService],
  imports: [TypeOrmModule.forFeature([PrestamoEntity, PagoEntity])],
  controllers: [PrestamoPagoController],
  exports: [PrestamoPagoService]
})
export class PrestamoPagoModule {}
