import { Module } from '@nestjs/common';

import { MemoryModule } from '../memory/memory.module';
import { ContextModule } from '../context/context.module';
import { RequirementsModule } from '../requirements/requirements.module';
import { ReasoningModule } from '../reasoning/reasoning.module';

import { BrainService } from './services/brain.service';

import { IntentModule } from './intents/intent.module';
import { BrainDecisionModule } from './decisions/brain-decision.module';

@Module({
  imports: [
    MemoryModule,
    ContextModule,
    RequirementsModule,
    ReasoningModule,
    IntentModule,
    BrainDecisionModule,
  ],
  providers: [
    BrainService,
  ],
  exports: [
    BrainService,
  ],
})
export class BrainModule {}