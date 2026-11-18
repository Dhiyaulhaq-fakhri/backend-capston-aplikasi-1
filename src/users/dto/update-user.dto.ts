import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    @Matches(/^\+?[0-9\s\-()]+$/, { message: 'phone harus berupa nomor telepon yang valid' })
    phone?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password?: string;
}