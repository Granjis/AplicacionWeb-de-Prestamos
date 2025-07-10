import { Column,OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { RecursoEntity } from '../recurso/recurso.entity';

@Entity()
export class PrestamistaEntity {
 @PrimaryGeneratedColumn()
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 direccion: string;
 
 @Column()
 telefono: string;
 
 @Column()
 correo: string;

 @Column()
 foto: string;

 @Column()
 fondosTotales: number;

 @Column()
 saldo: number;

 @OneToMany(() => RecursoEntity, recurso => recurso.prestamista)
 recursos: RecursoEntity[];

 @OneToMany(() => PrestamoEntity, prestamo => prestamo.prestamista)
 prestamos: PrestamoEntity[];
}