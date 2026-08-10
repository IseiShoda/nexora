import { Injectable } from '@nestjs/common';

import { ContextEntity } from '../entities/entity.interface';
import { ContextReference } from '../references/reference.interface';
import { ContextMessage } from '../interfaces/context.interface';
import { ContextScorer } from '../scoring/context.scorer';

@Injectable()
export class ReferenceResolver {
  constructor(
    private readonly scorer: ContextScorer,
  ) {}

  resolve(
    messages: ContextMessage[],
    entities: ContextEntity[],
  ): ContextReference[] {
    const references: ContextReference[] = [];

    const bestEntity =
      this.scorer.getBestEntity(
        entities,
      );

    for (const message of messages) {
      const normalized =
        this.normalize(
          message.content,
        );

      if (
        normalized.includes('il ') ||
        normalized.includes('elle ')
      ) {
        const pronoun =
          normalized.includes('elle ')
            ? 'elle'
            : 'il';

        references.push({
          value: pronoun,
          resolvedTo:
            bestEntity?.value ?? null,
          type: 'pronoun',
          confidence:
            bestEntity ? 0.8 : 0,
        });
      }

      if (
        normalized.includes(
          'ce projet',
        ) ||
        normalized.includes(
          'cette idee',
        ) ||
        normalized.includes('ca ') ||
        normalized.includes(
          'cela ',
        )
      ) {
        references.push({
          value: 'reference',
          resolvedTo:
            bestEntity?.value ?? null,
          type: 'demonstrative',
          confidence:
            bestEntity ? 0.75 : 0,
        });
      }
    }

    return references;
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
      .replace(
        /\s+/g,
        ' ',
      )
      .trim();
  }
}