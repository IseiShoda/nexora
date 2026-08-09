import { Module } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { ContextService } from './services/context.service';

@Module({
  providers: [
    PrismaService,
    ContextService,
  ],

  exports: [
    ContextService,
  ],
})
export class ContextModule {}