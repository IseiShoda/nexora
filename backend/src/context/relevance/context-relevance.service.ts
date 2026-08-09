import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { ContextEntity } from '../entities/entity.interface';

import {
  ContextRelevanceResult,
} from './relevance.interface';

import {
  RELEVANCE_EVALUATOR,
} from './relevance.evaluator';

import type {
  RelevanceEvaluator,
} from './relevance.evaluator';

@Injectable()
export class ContextRelevanceService {
  constructor(
    @Inject(RELEVANCE_EVALUATOR)
    private readonly evaluator: RelevanceEvaluator,
  ) {}

  evaluate(
    message: string,
    entities: ContextEntity[],
  ): ContextRelevanceResult {
    return this.evaluator.evaluate(
      message,
      entities,
    );
  }
}