import { Injectable } from '@nestjs/common';
import { ContextMessage } from '../interfaces/context.interface';
import { ContextEntity } from '../entities/entity.interface';

@Injectable()
export class EntityExtractor {
  extract(
    messages: ContextMessage[],
  ): ContextEntity[] {
    const entities: ContextEntity[] = [];

    for (const message of messages) {
      const content = message.content;

      const nexoraMatch =
        content.match(/\bNexora\b/i);

      if (nexoraMatch) {
        const exists = entities.some(
          (entity) =>
            entity.value.toLowerCase() ===
            'nexora',
        );

        if (!exists) {
          entities.push({
            type: 'project',
            value: 'Nexora',
            source: 'message',
            confidence: 1,
          });
        }
      }
    }

    return entities;
  }
}