import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivestockService } from './livestock.service.js';
import { LivestockController } from './livestock.controller.js';
import { Livestock } from './entities/livestock.entity.js';
import { LivestockImage } from './entities/livestock-image.entity.js';
import { FarmerProfile } from '../users/entities/farmer-profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Livestock, LivestockImage, FarmerProfile]),],
  providers: [LivestockService],
  controllers: [LivestockController]
})
export class LivestockModule {}
