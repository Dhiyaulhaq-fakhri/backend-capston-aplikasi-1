import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator.js';

export class RegisterDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    @MaxLength(70)
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password: string;

    @IsString()
    @Match('password', { message: 'Password dan konfirmasi password tidak cocok' })
    confirmPassword: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    @Matches(/^\+?[0-9\s\-()]+$/, { message: 'phone harus berupa nomor telepon yang valid' })
    phone?: string;
}