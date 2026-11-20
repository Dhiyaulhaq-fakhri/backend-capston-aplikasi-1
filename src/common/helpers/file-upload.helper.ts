import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { promises as fs } from 'fs';

export async function processAndSaveImage(
    file: Express.Multer.File,
    prefix: string = 'img',
    ): Promise<string> {
    const uniqueName = `${prefix}_${randomUUID()}.webp`;
    
    // Tentukan path folder
    const uploadPath = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadPath, uniqueName);

    // PASTIKAN FOLDER ADA. Jika belum, buat otomatis (recursive)
    await fs.mkdir(uploadPath, { recursive: true });

    // Proses dengan Sharp
    await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(filePath);

    return `/uploads/${uniqueName}`;
}