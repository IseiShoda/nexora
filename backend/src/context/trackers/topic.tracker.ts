import { Injectable } from '@nestjs/common';

import { ContextEntity } from '../entities/entity.interface';
import { ContextMessage } from '../interfaces/context.interface';

@Injectable()
export class TopicTracker {
  detect(
    messages: ContextMessage[],
    entities: ContextEntity[],
  ): string | null {
    /*
     * Certaines entités sont des informations personnelles
     * ou des données de mémoire et ne doivent pas devenir
     * automatiquement le sujet actif.
     */
    const topicEntities = entities.filter(
      (entity) =>
        entity.type === 'project' ||
        entity.type === 'company' ||
        entity.type === 'product' ||
        entity.type === 'organization',
    );

    /*
     * Priorité aux entités réellement pertinentes
     * pour représenter un sujet.
     */
    if (topicEntities.length > 0) {
      return topicEntities[
        topicEntities.length - 1
      ].value;
    }

    /*
     * Si aucune entité pertinente n'est disponible,
     * on utilise le dernier message utilisateur.
     */
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