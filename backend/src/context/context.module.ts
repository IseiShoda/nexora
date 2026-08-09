import { Module } from '@nestjs/common';
import { ContextService } from './services/context.service';
import { ContextRepository } from './repositories/context.repository';
import { EntityExtractor } from './extractors/entity.extractor';
import { TopicTracker } from './trackers/topic.tracker';
import { ReferenceResolver } from './resolvers/reference.resolver';
import { ContextScorer } from './scoring/context.scorer';
import { ActiveContextService } from './state/active-context.service';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  providers: [
    ContextService,
    ContextRepository,
    EntityExtractor,
    TopicTracker,
    ReferenceResolver,
    ContextScorer,
    ActiveContextService,
    PrismaService,
  ],
  exports: [
    ContextService,
  ],
})
export class ContextModule {}