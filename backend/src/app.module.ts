import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MemoryModule } from './memory/memory.module';
import { BrainModule } from './brain/brain.module';
import { ContextModule } from './context/context.module';
import { RequirementsModule } from './requirements/requirements.module';

@Module({
  imports: [
    ChatModule,
    MemoryModule,
    BrainModule,
    ContextModule,
    RequirementsModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}