import { ContextEntity } from '../entities/entity.interface';
import {
  ContextRelevanceResult,
} from './relevance.interface';

export const RELEVANCE_EVALUATOR =
  Symbol('RELEVANCE_EVALUATOR');

export interface RelevanceEvaluator {
  evaluate(
    message: string,
    entities: ContextEntity[],
  ): ContextRelevanceResult;
}