import { PagoEntity } from '../pago/pago.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeudorEntity } from '../deudor/deudor.entity';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { RecursoEntity } from '../recurso/recurso.entity';

@Entity()
export class PrestamoEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  nombre: string;

  @Column()
  monto: number;

  @Column()
  interes: number;

  @Column()
  fechainicio: Date;

  @Column()
  fechafin: Date;

  @Column()
  pagado: boolean;

  @ManyToOne(() => DeudorEntity, deudor => deudor.id, { onDelete: 'CASCADE' })
    deudor: DeudorEntity;

  @ManyToOne(() => PrestamistaEntity, prestamista => prestamista.id)
    prestamista: PrestamistaEntity;

  @OneToMany(() => PagoEntity, historialpagos => historialpagos.prestamo)
    historialpagos: PagoEntity[];

  @ManyToOne(() => RecursoEntity, recurso => recurso.prestamos)
  recurso: RecursoEntity; 
}