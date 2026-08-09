import { Injectable } from '@nestjs/common';
import { ContextEntity } from '../entities/entity.interface';
import {
  ContextRelevanceCandidate,
  ContextRelevanceResult,
} from './relevance.interface';
import { RelevanceEvaluator } from './relevance.evaluator';

@Injectable()
export class RuleBasedRelevanceEvaluator
  implements RelevanceEvaluator
{
  evaluate(
    message: string,
    entities: ContextEntity[],
  ): ContextRelevanceResult {
    if (entities.length === 0) {
      return {
        candidates: [],
        bestMatch: null,
      };
    }

    const normalizedMessage =
      this.normalize(message);

    const candidates: ContextRelevanceCandidate[] =
      entities.map((entity, index) => {
        let score = entity.confidence;

        const normalizedEntity =
          this.normalize(entity.value);

        // Correspondance directe.
        if (
          normalizedMessage.includes(
            normalizedEntity,
          )
        ) {
          score += 0.4;
        }

        // Les entités plus récentes
        // gardent un léger avantage.
        score += index * 0.05;

        score = Math.min(score, 1);

        let reason =
          'Contexte général';

        if (
          normalizedMessage.includes(
            normalizedEntity,
          )
        ) {
          reason =
            'Entité mentionnée directement';
        }

        return {
          entity: entity.value,
          score,
          reason,
        };
      });

    candidates.sort(
      (a, b) =>
        b.score - a.score,
    );

    return {
      candidates,
      bestMatch:
        candidates[0]?.entity ?? null,
    };
  }

  private normalize(
    text: string,
  ): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }
}