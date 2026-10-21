import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto.js';
import { PickType } from '@nestjs/mapped-types';

export class RegisterDto extends PickType(CreateUserDto, [
    'name',
    'email',
    'password',
    'phone',
] as const) {}