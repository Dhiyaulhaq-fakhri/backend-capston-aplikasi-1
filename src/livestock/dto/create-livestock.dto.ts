import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LivestockGender, LivestockType } from '../entities/livestock.entity.js';

export class CreateLivestockDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(LivestockType)
    type: LivestockType;

    @IsString()
    @IsOptional()
    breed?: string;

    // Karena dari form-data (multipart), angka dikirim sebagai string, jadi butuh @Type
    @IsNumber()
    @Min(0)
    @Type(() => Number) 
    price: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    weightKg?: number;

    @IsEnum(LivestockGender)
    @IsOptional()
    gender?: LivestockGender;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    ageMonths?: number;

    @IsString()
    @IsOptional()
    healthNote?: string;

    @IsString()
    @IsOptional()
    location?: string;
}