import { Module } from '@nestjs/common';
import { PrestamistaService } from './prestamista.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamistaEntity } from './prestamista.entity';
import { PrestamistaController } from './prestamista.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrestamistaEntity])],
  providers: [PrestamistaService],
  controllers: [PrestamistaController]
})

export class PrestamistaModule {}
