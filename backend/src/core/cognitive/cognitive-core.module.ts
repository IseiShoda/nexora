import { Module } from '@nestjs/common';

import { ContextModule } from '../../context/context.module';
import { ReasoningModule } from '../../reasoning/reasoning.module';
import { IntentModule } from '../../brain/intents/intent.module';
import { BrainDecisionModule } from '../../brain/decisions/brain-decision.module';

import { CognitiveCoreService } from './cognitive-core.service';

@Module({
  imports: [
    ContextModule,
    ReasoningModule,
    IntentModule,
    BrainDecisionModule,
  ],
  providers: [
    CognitiveCoreService,
  ],
  exports: [
    CognitiveCoreService,
  ],
})
export class CognitiveCoreModule {}