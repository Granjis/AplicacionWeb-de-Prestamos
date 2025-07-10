import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamistaEntity } from '../../prestamista/prestamista.entity';
import { RecursoEntity } from '../../recurso/recurso.entity';
import { PrestamoEntity } from '../../prestamo/prestamo.entity';
import { DeudorEntity } from '../../deudor/deudor.entity';
import { PagoEntity } from '../../pago/pago.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PrestamistaEntity, RecursoEntity, PrestamoEntity, DeudorEntity, PagoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([PrestamistaEntity, RecursoEntity, PrestamoEntity, DeudorEntity, PagoEntity]),
];
