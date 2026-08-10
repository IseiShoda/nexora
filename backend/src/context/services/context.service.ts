import { Injectable } from '@nestjs/common';

import { ContextRepository } from '../repositories/context.repository';
import { EntityExtractor } from '../extractors/entity.extractor';
import { TopicTracker } from '../trackers/topic.tracker';
import { ReferenceResolver } from '../resolvers/reference.resolver';
import { ContextScorer } from '../scoring/context.scorer';
import { ActiveContextService } from '../state/active-context.service';
import { ContextRelevanceService } from '../relevance/context-relevance.service';

import type { ConversationContext } from '../interfaces/context.interface';
import type { ContextEntity } from '../entities/entity.interface';

import { MemoryService } from '../../memory/services/memory.service';

@Injectable()
export class ContextService {
  constructor(
    private readonly repository: ContextRepository,
    private readonly entityExtractor: EntityExtractor,
    private readonly topicTracker: TopicTracker,
    private readonly referenceResolver: ReferenceResolver,
    private readonly contextScorer: ContextScorer,
    private readonly activeContextService: ActiveContextService,
    private readonly contextRelevanceService: ContextRelevanceService,
    private readonly memoryService: MemoryService,
  ) {}

  async getContext(
    conversationId: number,
    limit = 20,
  ): Promise<ConversationContext> {
    const messages =
      await this.repository.getMessages(
        conversationId,
        limit,
      );

    /*
     * 1. Extraction des entités présentes
     * directement dans la conversation.
     */
    const messageEntities =
      this.entityExtractor.extract(
        messages,
      );

    /*
     * 2. Récupération des informations
     * persistantes pertinentes.
     */
    const memoryEntities: ContextEntity[] = [];

    const currentProject =
      await this.memoryService.getCurrentProject();

    if (
      currentProject &&
      !messageEntities.some(
        (entity) =>
          entity.type === 'project' &&
          entity.value.toLowerCase() ===
            currentProject.toLowerCase(),
      )
    ) {
      memoryEntities.push({
        type: 'project',
        value: this.formatProjectName(
          currentProject,
        ),
        source: 'memory',
        confidence: 0.9,
      });
    }

    const userName =
      await this.memoryService.getUserName();

    if (
      userName &&
      !messageEntities.some(
        (entity) =>
          entity.type === 'name' &&
          entity.value.toLowerCase() ===
            userName.toLowerCase(),
      )
    ) {
      memoryEntities.push({
        type: 'name',
        value: userName,
        source: 'memory',
        confidence: 1,
      });
    }

    /*
     * 3. Fusion conversation + mémoire.
     *
     * La mémoire vient après les entités
     * directement détectées afin de pouvoir
     * représenter l'état persistant actuel.
     */
    const entities: ContextEntity[] = [
      ...messageEntities,
      ...memoryEntities,
    ];

    /*
     * 4. Scoring.
     */
    const scoredEntities =
      this.contextScorer.scoreEntities(
        entities,
      );

    /*
     * 5. Meilleure entité.
     */
    const bestEntity =
      this.contextScorer.getBestEntity(
        entities,
      );

    if (bestEntity) {
      this.activeContextService.setActiveContext(
        conversationId,
        bestEntity,
      );
    }

    const activeContext =
      this.activeContextService.getActiveContext(
        conversationId,
      );

    /*
     * 6. Pertinence du dernier message.
     */
    const lastMessage =
      messages[messages.length - 1]?.content ?? '';

    const relevance =
      this.contextRelevanceService.evaluate(
        lastMessage,
        entities,
      );

    /*
     * 7. Topic.
     *
     * Si un projet courant existe en mémoire,
     * il devient prioritaire comme sujet actif.
     */
    let activeTopic =
      this.topicTracker.detect(
        messages,
        entities,
      );

    if (currentProject) {
      activeTopic =
        this.formatProjectName(
          currentProject,
        );
    }

    /*
     * 8. Résolution des références.
     */
    const references =
      this.referenceResolver.resolve(
        messages,
        entities,
      );

    return {
      conversationId,
      messages,
      activeTopic,
      entities: scoredEntities.map(
        (item) => item.entity,
      ),
      references,
      relevance,
    };
  }

  async getRecentMessages(
    conversationId: number,
    limit = 10,
  ) {
    const context =
      await this.getContext(
        conversationId,
        limit,
      );

    return context.messages;
  }

  async getLastMessage(
    conversationId: number,
  ) {
    const messages =
      await this.repository.getMessages(
        conversationId,
        1,
      );

    if (messages.length === 0) {
      return null;
    }

    return messages[
      messages.length - 1
    ];
  }

  getActiveContext(
    conversationId: number,
  ) {
    return this.activeContextService
      .getActiveContext(
        conversationId,
      );
  }

  private formatProjectName(
    project: string,
  ): string {
    return project
      .split(' ')
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase(),
      )
      .join(' ');
  }
}