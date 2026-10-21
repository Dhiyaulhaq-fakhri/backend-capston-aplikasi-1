import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ApiResponse } from '../common/dto/api-response.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return ApiResponse.created(data, 'User berhasil dibuat');
  }

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return ApiResponse.ok(data, 'Daftar user');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.findById(id);
    return ApiResponse.ok(data, 'Detail user');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const data = await this.usersService.update(id, dto);
    return ApiResponse.ok(data, 'User berhasil diupdate');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return ApiResponse.ok(null, 'User berhasil dihapus');
  }
}