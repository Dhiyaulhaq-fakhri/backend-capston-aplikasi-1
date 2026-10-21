import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const exists = await this.usersRepository.findOneBy({ email: dto.email });
    if (exists) throw new ConflictException('Email sudah terdaftar');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone ?? null,
      role: dto.role ?? 'user',
    });
    const saved = await this.usersRepository.save(user);

    const { password, ...rest } = saved;
    return rest;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} tidak ditemukan`);
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    await this.findById(id); // pastikan ada

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.usersRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    await this.findById(id);
    await this.usersRepository.delete(id);
    return { deleted: true };
  }
}