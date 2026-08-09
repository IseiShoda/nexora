import { Module } from '@nestjs/common';

import { ContextController } from './context.controller';

import { ContextService } from './services/context.service';
import { ContextRepository } from './repositories/context.repository';

import { EntityExtractor } from './extractors/entity.extractor';
import { TopicTracker } from './trackers/topic.tracker';
import { ReferenceResolver } from './resolvers/reference.resolver';

import { ContextScorer } from './scoring/context.scorer';
import { ActiveContextService } from './state/active-context.service';

import { ContextRelevanceService } from './relevance/context-relevance.service';

import {
  RELEVANCE_EVALUATOR,
} from './relevance/relevance.evaluator';

import { RuleBasedRelevanceEvaluator } from './relevance/rule-based-relevance.evaluator';

import { PrismaService } from '../Prisma/prisma.service';

@Module({
  controllers: [
    ContextController,
  ],

  providers: [
    ContextService,
    ContextRepository,

    EntityExtractor,
    TopicTracker,
    ReferenceResolver,

    ContextScorer,
    ActiveContextService,

    ContextRelevanceService,

    {
      provide: RELEVANCE_EVALUATOR,
      useClass:
        RuleBasedRelevanceEvaluator,
    },

    PrismaService,
  ],

  exports: [
    ContextService,
    ContextRelevanceService,
  ],
})
export class ContextModule {}