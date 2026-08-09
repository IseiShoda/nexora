import { Module } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { MemoryController } from './controllers/memory.controller';
import { MemoryService } from './services/memory.service';
import {
  MEMORY_REPOSITORY,
} from './repositories/memory.repository';
import { PrismaMemoryRepository } from './repositories/prisma-memory.repository';

@Module({
  controllers: [MemoryController],

  providers: [
    PrismaService,
    MemoryService,
    PrismaMemoryRepository,
    {
      provide: MEMORY_REPOSITORY,
      useExisting: PrismaMemoryRepository,
    },
  ],

  exports: [MemoryService],
})
export class MemoryModule {}