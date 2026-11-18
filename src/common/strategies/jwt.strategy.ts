import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service.js';
import { UserRole } from '../enums/user-role.enum.js';
import { requireEnv } from '../config/env.js';

interface JwtPayload {
    sub: number | string;
    email: string;
    role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: requireEnv('JWT_SECRET'),  // ✅ string, bukan string | undefined
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findById(Number(payload.sub));
        if (!user) throw new UnauthorizedException('User tidak ditemukan');
        return user;
    }
}