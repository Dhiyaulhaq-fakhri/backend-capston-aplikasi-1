import { 
    Controller, Post, Body, UseGuards, Req, 
    UploadedFiles, UseInterceptors, 
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Delete
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LivestockService } from './livestock.service.js';
import { CreateLivestockDto } from './dto/create-livestock.dto.js';
import { JwtAuthGuard } from '../common/strategies/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { ApiResponse } from '../common/dto/api-response.dto.js';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.js';
import { UpdateLivestockDto } from './dto/update-livestock.dto.js';

@Controller('livestock')
export class LivestockController {
    constructor(private readonly livestockService: LivestockService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.FARMER) // Hanya Farmer yang bisa akses
    @UseInterceptors(FilesInterceptor('images', 5)) // Maksimal 5 gambar, key form-data: "images"
    async create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateLivestockDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        // Controller hanya memanggil, tidak ada IF atau logika lain
        const data = await this.livestockService.create(req.user.id, dto, files);
        return ApiResponse.created(data, 'Ternak berhasil ditambahkan');
    }

    @Get()
    async findAll() {
        const data = await this.livestockService.findAll();
        return ApiResponse.ok(data, 'Daftar katalog ternak');
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const data = await this.livestockService.findOne(id);
        return ApiResponse.ok(data, 'Detail ternak');
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.FARMER)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateLivestockDto,
    ) {
        const data = await this.livestockService.update(id, req.user.id, dto);
        return ApiResponse.ok(data, 'Ternak berhasil diupdate');
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.FARMER)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest,
    ) {
        await this.livestockService.remove(id, req.user.id);
        return ApiResponse.ok(null, 'Ternak berhasil dihapus');
    }
}