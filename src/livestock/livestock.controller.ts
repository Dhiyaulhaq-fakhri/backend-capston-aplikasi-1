import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { processAndSaveImage } from '../common/helpers/file-upload.helper.js';

@Controller('livestock')
export class LivestockController {

    // Endpoint dummy untuk tes upload
    @Post('test-upload')
    @UseInterceptors(FileInterceptor('image')) // 'image' adalah nama key di form-data
    async testUpload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
        throw new Error('File tidak ditemukan');
        }
        
        // Panggil helper yang kita buat
        const url = await processAndSaveImage(file, 'test');
        
        return {
        message: 'Upload berhasil',
        url: url,
        originalName: file.originalname,
        sizeInBytes: file.size,
        };
    }
}
