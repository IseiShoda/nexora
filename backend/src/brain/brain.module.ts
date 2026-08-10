import { Module } from '@nestjs/common';

import { MemoryModule } from '../memory/memory.module';
import { ContextModule } from '../context/context.module';

import { BrainService } from './services/brain.service';
import { IntentService } from './intents/intent.service';

import { BrainDecisionService } from './decisions/brain-decision.service';
import { RequirementsModule } from '../requirements/requirements.module';

@Module({
  imports: [
    MemoryModule,
    ContextModule,
    RequirementsModule,
  ],

  providers: [
    BrainService,
    IntentService,
    BrainDecisionService,
  ],

  exports: [
    BrainService,
  ],
})
export class BrainModule {}