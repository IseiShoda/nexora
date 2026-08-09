import { ContextEntity } from '../entities/entity.interface';
import { ContextReference } from '../references/reference.interface';
import { ContextRelevanceResult } from '../relevance/relevance.interface';

export interface ContextMessage {
  role: string;
  content: string;
  createdAt: Date;
}

export interface ConversationContext {
  conversationId: number;
  messages: ContextMessage[];

  activeTopic: string | null;

  entities: ContextEntity[];

  references: ContextReference[];

  relevance: ContextRelevanceResult;
}