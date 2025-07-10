import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PagoEntity])],
  providers: [PagoService],
  controllers: [PagoController]
})
export class PagoModule {}
