import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '../Prisma/prisma.service';
import { MemoryModule } from '../memory/memory.module';
import { BrainModule } from '../brain/brain.module';

@Module({
  imports: [
    MemoryModule,
    BrainModule,
  ],

  controllers: [
    ChatController,
  ],

  providers: [
    ChatService,
    PrismaService,
  ],
})
export class ChatModule {}