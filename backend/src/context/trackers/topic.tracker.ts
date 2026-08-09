import { Injectable } from '@nestjs/common';
import { ContextEntity } from '../entities/entity.interface';
import { ContextMessage } from '../interfaces/context.interface';

@Injectable()
export class TopicTracker {
  detect(
    messages: ContextMessage[],
    entities: ContextEntity[],
  ): string | null {
    if (entities.length > 0) {
      return entities[
        entities.length - 1
      ].value;
    }

    const lastUserMessage =
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === 'user',
        );

    if (!lastUserMessage) {
      return null;
    }

    return lastUserMessage.content;
  }
}