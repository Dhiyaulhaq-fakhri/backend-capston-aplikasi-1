import { PartialType } from '@nestjs/mapped-types';
import { CreateLivestockDto } from './create-livestock.dto.js';
import { IsOptional, IsEnum } from 'class-validator';
import { LivestockStatus } from '../entities/livestock.entity.js';

// PartialType otomatis membuat semua properti dari CreateLivestockDto menjadi opsional
export class UpdateLivestockDto extends PartialType(CreateLivestockDto) {
    @IsOptional()
    @IsEnum(LivestockStatus)
    status?: LivestockStatus;
}