import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyFarmerDto {
    @IsString()
    @IsNotEmpty()
    storeName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    ktpNumber?: string;

    @IsString()
    @IsOptional()
    nibNumber?: string;
}