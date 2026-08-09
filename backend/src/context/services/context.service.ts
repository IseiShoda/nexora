import { Injectable } from '@nestjs/common';

import { ContextRepository } from '../repositories/context.repository';
import { EntityExtractor } from '../extractors/entity.extractor';
import { TopicTracker } from '../trackers/topic.tracker';
import { ReferenceResolver } from '../resolvers/reference.resolver';
import { ContextScorer } from '../scoring/context.scorer';
import { ActiveContextService } from '../state/active-context.service';

import type {
  ConversationContext,
} from '../interfaces/context.interface';

import { ContextRelevanceService } from '../relevance/context-relevance.service';

import { MemoryService } from '../../memory/services/memory.service';

import type {
  ContextEntity,
} from '../entities/entity.interface';

@Injectable()
export class ContextService {
  constructor(
    private readonly repository: ContextRepository,
    private readonly entityExtractor: EntityExtractor,
    private readonly topicTracker: TopicTracker,
    private readonly referenceResolver: ReferenceResolver,
    private readonly contextScorer: ContextScorer,
    private readonly activeContextService: ActiveContextService,
    private readonly contextRelevanceService:
      ContextRelevanceService,
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
     * 1. Entities provenant de la conversation
     */
    const messageEntities =
      this.entityExtractor.extract(
        messages,
      );

    /*
     * 2. Memories disponibles
     */
    const memories =
      await this.memoryService.getAll();

    /*
     * 3. Transformation des memories
     *    en entités utilisables par Context.
     */
    const memoryEntities: ContextEntity[] =
      memories.map((memory) => ({
        type: memory.key,
        value: memory.value,
        source: 'memory',
        confidence: 1,
      }));

    /*
     * 4. Fusion conversation + mémoire
     */
    const entities: ContextEntity[] = [
      ...messageEntities,
      ...memoryEntities.filter(
        (memoryEntity) =>
          !messageEntities.some(
            (messageEntity) =>
              messageEntity.value.toLowerCase() ===
              memoryEntity.value.toLowerCase(),
          ),
      ),
    ];

    /*
     * 5. Scoring
     */
    const scoredEntities =
      this.contextScorer.scoreEntities(
        entities,
      );

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
     * 6. Relevance
     */
    const relevance =
      this.contextRelevanceService.evaluate(
        messages[messages.length - 1]?.content ?? '',
        entities,
      );

    /*
     * 7. Topic
     */
    const activeTopic =
      this.topicTracker.detect(
        messages,
        entities,
      );

    /*
     * 8. References
     */
    const references =
      this.referenceResolver.resolve(
        messages,
        entities,
      );

    return {
      conversationId,
      messages,
      activeTopic:
        activeTopic ?? activeContext?.value ?? null,
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
}