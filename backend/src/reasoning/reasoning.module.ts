import { Module } from '@nestjs/common';

import { ReasoningService } from './services/reasoning.service';

@Module({
  providers: [ReasoningService],
  exports: [ReasoningService],
})
export class ReasoningModule {}