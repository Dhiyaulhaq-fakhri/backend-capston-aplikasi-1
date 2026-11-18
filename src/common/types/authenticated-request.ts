// src/common/types/authenticated-request.ts
import { Request } from 'express';
import { UserRole } from '../enums/user-role.enum.js';

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}