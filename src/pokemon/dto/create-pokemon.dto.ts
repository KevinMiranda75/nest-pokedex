import { IsNumber, IsString,MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsString({ message: 'Falta Name is String'})
    @MinLength(2, {message: 'minimo 2 letras'})

    name: string;

    @IsNumber({}, { message: 'El campo "no" debe ser un número' })
    no: number;

}
