import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '../common/dto/api-response.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const data = await this.authService.register(dto);
        return ApiResponse.created(data, 'Registrasi berhasil');
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const data = await this.authService.login(dto);
        return ApiResponse.ok(data, 'Login berhasil');
    }
}
