import { Module } from '@nestjs/common';
import { MemoryModule } from '../memory/memory.module';
import { ContextModule } from '../context/context.module';
import { BrainService } from './services/brain.service';
import { IntentService } from './intents/intent.service';

@Module({
  imports: [
    MemoryModule,
    ContextModule,
  ],

  providers: [
    BrainService,
    IntentService,
  ],

  exports: [
    BrainService,
  ],
})
export class BrainModule {}