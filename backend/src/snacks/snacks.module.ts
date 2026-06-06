import { Module } from '@nestjs/common';
import { SnacksController } from './snacks.controller';
import { SnacksService } from './snacks.service';
import { SnacksRepository } from './snacks.repository';

@Module({
  controllers: [SnacksController],
  providers: [SnacksService, SnacksRepository],
  exports: [SnacksService, SnacksRepository],
})
export class SnacksModule {}
