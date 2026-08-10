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

        /*
         * Un projet actuellement présent
         * en mémoire représente l'état courant
         * du travail de l'utilisateur.
         */
        if (
          entity.source === 'memory' &&
          entity.type === 'project'
        ) {
          score += 0.5;
        }

        /*
         * Une entité projet mentionnée directement
         * dans la conversation reste importante,
         * mais elle ne doit pas écraser le projet
         * actuellement mémorisé.
         */
        if (
          entity.source === 'message' &&
          entity.type === 'project'
        ) {
          score += 0.1;
        }

        /*
         * Un nom d'utilisateur est une information
         * de mémoire, mais ce n'est pas un sujet
         * de conversation par défaut.
         */
        if (entity.type === 'name') {
          score -= 0.5;
        }

        /*
         * Petit avantage aux entités plus récentes.
         */
        score += index * 0.01;

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