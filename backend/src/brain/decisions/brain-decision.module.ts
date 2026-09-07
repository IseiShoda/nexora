import { Module } from '@nestjs/common';

import { BrainDecisionService } from './brain-decision.service';

@Module({
  providers: [BrainDecisionService],
  exports: [BrainDecisionService],
})
export class BrainDecisionModule {}