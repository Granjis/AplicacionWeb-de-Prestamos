import {IsNotEmpty, IsString,IsNumber, isIn} from 'class-validator';

export class RecursoDto
 {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    valor: string;
    
}
