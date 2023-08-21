import { Module } from '@nestjs/common';
import { AdvertisementsController } from './advertisements.controller';
import { AdvertisementsService } from './advertisements.service';

@Module({
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService]
})
export class AdvertisementsModule {}
