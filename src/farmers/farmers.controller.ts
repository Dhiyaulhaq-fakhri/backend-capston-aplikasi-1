import { Controller, Post, Body, Get, Patch, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { FarmersService } from './farmers.service.js';
import { ApplyFarmerDto } from '../users/dto/apply-farmer.dto.js';
import { JwtAuthGuard } from '../common/strategies/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { ApiResponse } from '../common/dto/api-response.dto.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';

@Controller('farmers')
@UseGuards(JwtAuthGuard)
export class FarmersController {
    constructor(private readonly farmersService: FarmersService) {}

  // 1. Customer ajukan jadi Mitra
    @Post('apply')
    async apply(@Req() req: AuthenticatedRequest, @Body() dto: ApplyFarmerDto) {
        const data = await this.farmersService.apply(req.user.id, dto);
        return ApiResponse.created(data, 'Pengajuan berhasil, tunggu verifikasi admin');
    }

  // 2. Cek status pengajuan
    @Get('me')
    async getMyStatus(@Req() req: AuthenticatedRequest) {
        const data = await this.farmersService.getMyStatus(req.user.id);
        return ApiResponse.ok(data, 'Status pengajuan kamu');
    }

  // 3. Admin verifikasi
    @Patch(':id/verify')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async verify(
        @Param('id', ParseIntPipe) id: number,
        @Body('isApproved') isApproved: boolean,
    ) {
        const data = await this.farmersService.verify(id, isApproved);
        return ApiResponse.ok(data, isApproved ? 'Mitra disetujui' : 'Pengajuan ditolak');
    }
}