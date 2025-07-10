
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsDate } from "class-validator";

export class PagoDto {
   @Transform(({ value }) => new Date(value))
   @IsDate()
   @IsNotEmpty()
   readonly fecha: Date;

   @IsNumber()
   @IsNotEmpty()
   readonly capital: number;

   @IsNumber()
   @IsNotEmpty()
   readonly interes: number;


}
