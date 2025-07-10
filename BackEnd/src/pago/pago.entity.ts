import { PrestamoEntity } from "../prestamo/prestamo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PagoEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column() 
    fecha: Date;

    @Column() 
    capital: number;

    @Column() 
    interes: number;

    //TODO historialpagos o historial_pagos?
    @ManyToOne(() => PrestamoEntity, prestamo => prestamo.historialpagos)
    prestamo: PrestamoEntity;


}
