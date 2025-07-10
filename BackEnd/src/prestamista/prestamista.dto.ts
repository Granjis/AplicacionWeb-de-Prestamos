import {IsNotEmpty, IsString, IsEmail, IsNumber} from 'class-validator';

export class PrestamistaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    direccion: string;
    
    @IsString()
    @IsNotEmpty()
    telefono: string;
    
    @IsEmail()
    @IsNotEmpty()
    correo: string;
   
    @IsString()
    @IsNotEmpty()
    foto: string;
   
    @IsNumber()
    @IsNotEmpty()
    fondosTotales: number;
   
    @IsNumber()
    @IsNotEmpty()
    saldo: number;
}
