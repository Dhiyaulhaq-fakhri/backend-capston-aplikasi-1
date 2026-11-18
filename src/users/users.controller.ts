import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiResponse } from '../common/dto/api-response.dto.js';
import { JwtAuthGuard } from '../common/strategies/jwt-auth.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import type { AuthenticatedRequest }  from '../common/types/authenticated-request.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  Profil sendiri — dari token, bukan dari URL
  @Get('me')
  async me(@Req() req : AuthenticatedRequest) {
    return ApiResponse.ok(req.user, 'Profil saya');
  }
  

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return ApiResponse.created(data, 'User berhasil dibuat');
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const data = await this.usersService.findAll();
    return ApiResponse.ok(data, 'Daftar user');
  }

  //  Admin boleh lihat siapa pun; user biasa hanya dirinya sendiri
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req : AuthenticatedRequest) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Tidak boleh melihat user lain');
    }
    const data = await this.usersService.findById(id);
    return ApiResponse.ok(data, 'Detail user');
  }

  //  Sama: admin atau pemilik sendiri
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req : AuthenticatedRequest,
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Tidak boleh mengubah user lain');
    }
    const data = await this.usersService.update(id, dto);
    return ApiResponse.ok(data, 'User berhasil diupdate');
  }

  //  Admin atau pemilik sendiri
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req : AuthenticatedRequest) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Tidak boleh menghapus user lain');
    }
    await this.usersService.remove(id);
    return ApiResponse.ok(null, 'User berhasil dihapus');
  }
}