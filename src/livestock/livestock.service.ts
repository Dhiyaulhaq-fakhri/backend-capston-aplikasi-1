import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livestock, LivestockStatus } from './entities/livestock.entity.js';
import { LivestockImage } from './entities/livestock-image.entity.js';
import { CreateLivestockDto } from './dto/create-livestock.dto.js';
import { FarmerProfile } from '../users/entities/farmer-profile.entity.js';
import { processAndSaveImage } from '../common/helpers/file-upload.helper.js';
import { UpdateLivestockDto } from './dto/update-livestock.dto.js';

@Injectable()
export class LivestockService {
    constructor(
        @InjectRepository(Livestock)
        private livestockRepo: Repository<Livestock>,
        @InjectRepository(LivestockImage)
        private imageRepo: Repository<LivestockImage>,
        @InjectRepository(FarmerProfile)
        private farmerRepo: Repository<FarmerProfile>,
    ) {}

    async create(userId: number, dto: CreateLivestockDto, files: Express.Multer.File[]) {
        // Validasi dipindah ke sini
        if (!files || files.length === 0) {
            throw new BadRequestException('Minimal harus mengunggah 1 gambar ternak');
        }
        
        // 1. Cari tahu FarmerProfile milik user ini
        const farmer = await this.farmerRepo.findOneBy({ userId });
        if (!farmer) {
        throw new NotFoundException('Profil peternak tidak ditemukan. Pastikan kamu sudah jadi Mitra.');
        }

        // 2. Simpan data teks ternak terlebih dahulu
        const livestock = this.livestockRepo.create({
            ...dto,
            sellerId: farmer.id,
            status: LivestockStatus.AVAILABLE,
        });
        const savedLivestock = await this.livestockRepo.save(livestock);

        // 3. Looping file gambar, proses dengan sharp, lalu simpan ke tabel image
        const imagePromises = files.map(async (file, index) => {
            // Proses gambar (resize + webp)
            const url = await processAndSaveImage(file, 'sapi'); 
            
            // Siapkan data untuk tabel LivestockImage
            const image = this.imageRepo.create({
            url: url,
            order: index, // 0 untuk foto utama, 1 untuk kedua, dst.
            livestockId: savedLivestock.id,
            });
            
            return image;
        });

        // Jalankan semua proses secara paralel
        const images = await Promise.all(imagePromises);
        await this.imageRepo.save(images);

        // 4. Ambil ulang data dari DB beserta relasi gambarnya untuk response
        return this.livestockRepo.findOne({
        where: { id: savedLivestock.id },
        relations: { images: true, seller: true },
        });
    }

    // METHOD BARU UNTUK SPRINT 4
    async findAll() {
        return this.livestockRepo.find({
            where: { status: LivestockStatus.AVAILABLE },
            relations: { images: true, seller: true },
            order: { createdAt: 'DESC' },
        });
    }

    // METHOD BARU UNTUK SPRINT 4
    async findOne(id: number) {
        const livestock = await this.livestockRepo.findOne({
            where: { id },
            relations: { images: true, seller: true },
            order: { images: { order: 'ASC' } },
        });

        if (!livestock) {
            throw new NotFoundException(`Ternak dengan ID #${id} tidak ditemukan`);
        }

        return livestock;
    }

    async update(id: number, userId: number, dto: UpdateLivestockDto) {
        // 1. Cari ternaknya
        const livestock = await this.livestockRepo.findOne({
        where: { id },
        relations: { seller: true }, // Ambil data seller untuk cek kepemilikan
        });
        if (!livestock) throw new NotFoundException(`Ternak #${id} tidak ditemukan`);

        // 2. Cari tahu FarmerProfile milik user yang login
        const farmer = await this.farmerRepo.findOneBy({ userId });
        
        // 3. Cek kepemilikan: Apakah ternak ini milik farmer tersebut?
        if (!farmer || livestock.sellerId !== farmer.id) {
        throw new ForbiddenException('Kamu tidak berhak mengubah ternak milik orang lain');
        }

        // 4. Update data
        Object.assign(livestock, dto);
        return this.livestockRepo.save(livestock);
    }

    async remove(id: number, userId: number) {
        // 1. Cari ternaknya
        const livestock = await this.livestockRepo.findOneBy({ id });
        if (!livestock) throw new NotFoundException(`Ternak #${id} tidak ditemukan`);

        // 2. Cek kepemilikan
        const farmer = await this.farmerRepo.findOneBy({ userId });
        if (!farmer || livestock.sellerId !== farmer.id) {
        throw new ForbiddenException('Kamu tidak berhak menghapus ternak milik orang lain');
        }

        // 3. Soft delete (karena entity Livestock sudah pakai @DeleteDateColumn)
        await this.livestockRepo.softDelete(id);
        
        return { deleted: true };
    }
}