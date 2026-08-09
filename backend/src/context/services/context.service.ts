import { Injectable } from '@nestjs/common';
import { ContextRepository } from '../repositories/context.repository';
import { EntityExtractor } from '../extractors/entity.extractor';
import { TopicTracker } from '../trackers/topic.tracker';
import { ReferenceResolver } from '../resolvers/reference.resolver';
import { ContextScorer } from '../scoring/context.scorer';
import { ActiveContextService } from '../state/active-context.service';
import { ConversationContext } from '../interfaces/context.interface';
import { ContextRelevanceService } from '../relevance/context-relevance.service';

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

    const entities =
      this.entityExtractor.extract(
        messages,
      );

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

    const relevance =
      this.contextRelevanceService.evaluate(
      messages[messages.length - 1]?.content ?? '',
      entities,
      );

    const activeTopic =
      this.topicTracker.detect(
        messages,
        entities,
      );

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
}