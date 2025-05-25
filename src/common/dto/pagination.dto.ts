import { IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Max(20)
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    page?: number;
}