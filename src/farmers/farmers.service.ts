import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerProfile, FarmerStatus } from '../users/entities/farmer-profile.entity.js';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { ApplyFarmerDto } from '../users/dto/apply-farmer.dto.js';

@Injectable()
export class FarmersService {
    constructor(
        @InjectRepository(FarmerProfile)
        private farmerRepo: Repository<FarmerProfile>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async apply(userId: number, dto: ApplyFarmerDto) {
        const existing = await this.farmerRepo.findOneBy({ userId });
        if (existing) {
        throw new ConflictException('Kamu sudah pernah mengajukan diri sebagai Mitra/Farmer');
    }

    const profile = this.farmerRepo.create({
        userId,
        ...dto,
        status: FarmerStatus.PENDING,
    });

    return this.farmerRepo.save(profile);
    }

    async getMyStatus(userId: number) {
        const profile = await this.farmerRepo.findOneBy({ userId });
        if (!profile) {
        throw new NotFoundException('Kamu belum mengajukan diri sebagai Mitra');
        }
        return profile;
    }

    async verify(farmerProfileId: number, isApproved: boolean) {
        const profile = await this.farmerRepo.findOne({
        where: { id: farmerProfileId },
        relations: { user: true },
        });
        
        if (!profile) throw new NotFoundException('Pengajuan tidak ditemukan');
        if (profile.status !== FarmerStatus.PENDING) {
        throw new BadRequestException('Pengajuan ini sudah diproses sebelumnya');
        }

        if (isApproved) {
        profile.status = FarmerStatus.VERIFIED;
        // Ubah role user jadi FARMER
        await this.userRepo.update(profile.userId, { role: UserRole.FARMER });
        } else {
        profile.status = FarmerStatus.REJECTED;
        }

        return this.farmerRepo.save(profile);
    }
}