import { Module } from '@nestjs/common';

import { MemoryModule } from '../memory/memory.module';
import { ContextModule } from '../context/context.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { ReasoningModule } from '../reasoning/reasoning.module';

import { BrainService } from './services/brain.service';
import { IntentService } from './intents/intent.service';
import { BrainDecisionService } from './decisions/brain-decision.service';

@Module({
  imports: [
    MemoryModule,
    ContextModule,
    RequirementsModule,
    ReasoningModule,
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