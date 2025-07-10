import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { Column } from 'typeorm';
export class PrestamoDto {

    @IsNumber()
    @IsNotEmpty()
    monto: number;

    @Column()
    @IsString()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    interes: number;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    fechainicio: Date;

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    fechafin: Date;

    @IsBoolean()
    @IsNotEmpty()
    pagado: Boolean;

}