import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PrestamistaEntity } from '../prestamista/prestamista.entity'; 
import { PrestamoEntity } from '../prestamo/prestamo.entity';

@Entity() 
export class RecursoEntity {
    @PrimaryGeneratedColumn() 
    id: string;

    @Column()
    nombre: string;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;  
    
    @Column()
    valor: number;
    
    @ManyToOne(() => PrestamistaEntity, prestamista => prestamista.recursos)
    prestamista: PrestamistaEntity;

    @OneToMany(() => PrestamoEntity, prestamo => prestamo.recurso)
    prestamos: PrestamoEntity[];
}
