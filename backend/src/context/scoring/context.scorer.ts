import { Injectable } from '@nestjs/common';
import { ContextEntity } from '../entities/entity.interface';

export interface ScoredEntity {
  entity: ContextEntity;
  score: number;
}

@Injectable()
export class ContextScorer {
  scoreEntities(
    entities: ContextEntity[],
  ): ScoredEntity[] {
    return entities
      .map((entity, index) => {
        let score = entity.confidence;

        // Les entités les plus récentes
        // sont légèrement favorisées.
        score += index * 0.1;

        // Limite du score.
        score = Math.min(score, 1);

        return {
          entity,
          score,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score,
      );
  }

  getBestEntity(
    entities: ContextEntity[],
  ): ContextEntity | null {
    const scored =
      this.scoreEntities(entities);

    if (scored.length === 0) {
      return null;
    }

    return scored[0].entity;
  }
}