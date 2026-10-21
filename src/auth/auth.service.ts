import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
}

export interface AuthResult {
    user: AuthUser;
    accessToken: string;
}


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto): Promise<AuthResult> {
        const created = await this.usersService.create(dto);

        const accessToken = await this.signToken(created.id, created.email);

        return {
            user: this.toAuthUser(created),
            accessToken,
        };
    }

    async login(dto: LoginDto): Promise<AuthResult> {
        const user = await this.usersService.findByEmailWithPassword(dto.email);
        if (!user) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const accessToken = await this.signToken(user.id, user.email);

        return {
            user: this.toAuthUser(user),
            accessToken,
        };
    }

    private signToken(userId: number, email: string): Promise<string> {
        return this.jwtService.signAsync({ sub: userId, email });
    }

    private toAuthUser(user: AuthUser): AuthUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
    }
}
