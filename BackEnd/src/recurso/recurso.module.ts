import { Module } from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { RecursoEntity } from './recurso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoController } from './recurso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecursoEntity])],
  providers: [RecursoService],
  exports: [RecursoService],
  controllers: [RecursoController],
})
export class RecursoModule {}
