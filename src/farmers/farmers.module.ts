import { Module } from '@nestjs/common';
import { FarmersController } from './farmers.controller.js';
import { FarmersService } from './farmers.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmerProfile } from '../users/entities/farmer-profile.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([FarmerProfile, User])],
  controllers: [FarmersController],
  providers: [FarmersService]
})
export class FarmersModule {}
