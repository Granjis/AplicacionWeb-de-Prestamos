import { Module } from '@nestjs/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PrestamoService } from './prestamo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamoEntity } from './prestamo.entity';
import { PrestamoController } from './prestamo.controller';

@Module({
    providers: [PrestamoService],
    imports: [TypeOrmModule.forFeature([PrestamoEntity])],
    controllers: [PrestamoController],
    exports: [PrestamoService],
})
export class PrestamoModule {}
