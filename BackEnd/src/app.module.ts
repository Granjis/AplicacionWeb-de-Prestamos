import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DeudorModule } from './deudor/deudor.module';
import { DeudorEntity } from './deudor/deudor.entity';
import {PrestamoModule } from './prestamo/prestamo.module';
import { PrestamoEntity } from './prestamo/prestamo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeudorPrestamoModule } from './deudor-prestamo/deudor-prestamo.module';
import { PrestamistaModule } from './prestamista/prestamista.module';
import { PrestamistaEntity } from './prestamista/prestamista.entity';
import { RecursoModule } from './recurso/recurso.module';
import { RecursoEntity } from './recurso/recurso.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth/local-auth.guard';
import { PrestamistaPrestamoModule } from './prestamista-prestamo/prestamista-prestamo.module';
import { PrestamistaRecursoModule } from './prestamista-recurso/prestamista-recurso.module';
import { PagoModule } from './pago/pago.module';
import { PagoEntity } from './pago/pago.entity';
import { PrestamoPagoModule } from './prestamo-pago/prestamo-pago.module';
import { RecursoPrestamoModule } from './recurso-prestamo/recurso-prestamo.module';

@Module({
  imports: [DeudorModule, PrestamoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',   
      password: 'postgres',
      database: 'Prest',
      entities: [PrestamoEntity, DeudorEntity, PrestamistaEntity, RecursoEntity, PagoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    DeudorPrestamoModule,
    PrestamistaModule,
    RecursoModule,
    UserModule,
    AuthModule,
    PrestamistaPrestamoModule,
    PrestamistaRecursoModule,
    PagoModule,
    PrestamoPagoModule,
    RecursoPrestamoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
