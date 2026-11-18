import {IsEmail, IsIn, IsInt, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class CreateUserDto {
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

    @IsOptional()
    @IsString()
    @MaxLength(25)
    @Matches(/^\+?[0-9\s\-()]+$/, {
    message: 'phone harus berupa nomor telepon yang valid',
    })
    phone?: string;
}
