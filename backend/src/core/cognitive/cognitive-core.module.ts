import { Module } from '@nestjs/common';

import { CognitiveCoreService } from './cognitive-core.service';

@Module({
  providers: [CognitiveCoreService],
  exports: [CognitiveCoreService],
})
export class CognitiveCoreModule {}