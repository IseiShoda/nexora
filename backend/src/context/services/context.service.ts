import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import {
  ConversationContext,
  ContextMessage,
} from '../interfaces/context.interface';
import { ContextEntity } from '../entities/entity.interface';
import { ContextReference } from '../references/reference.interface';

@Injectable()
export class ContextService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getContext(
    conversationId: number,
    limit = 20,
  ): Promise<ConversationContext> {
    const messages =
      await this.prisma.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

    const orderedMessages =
      messages.reverse();

    const contextMessages: ContextMessage[] =
      orderedMessages.map((message) => ({
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      }));

    const entities =
      this.extractEntities(
        contextMessages,
      );

    const activeTopic =
      this.detectActiveTopic(
        contextMessages,
        entities,
      );

    const references =
      this.resolveReferences(
        contextMessages,
        entities,
      );

    return {
      conversationId,
      messages: contextMessages,
      activeTopic,
      entities,
      references,
    };
  }

  async getRecentMessages(
    conversationId: number,
    limit = 10,
  ): Promise<ContextMessage[]> {
    const context =
      await this.getContext(
        conversationId,
        limit,
      );

    return context.messages;
  }

  async getLastMessage(
    conversationId: number,
  ): Promise<ContextMessage | null> {
    const messages =
      await this.prisma.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });

    if (messages.length === 0) {
      return null;
    }

    return {
      role: messages[0].role,
      content: messages[0].content,
      createdAt: messages[0].createdAt,
    };
  }

  private extractEntities(
    messages: ContextMessage[],
  ): ContextEntity[] {
    const entities: ContextEntity[] = [];

    for (const message of messages) {
      const content = message.content;

      const nexoraMatch =
        content.match(/\bNexora\b/i);

      if (nexoraMatch) {
        const alreadyExists =
          entities.some(
            (entity) =>
              entity.value.toLowerCase() ===
              'nexora',
          );

        if (!alreadyExists) {
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

  private detectActiveTopic(
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

  private resolveReferences(
    messages: ContextMessage[],
    entities: ContextEntity[],
  ): ContextReference[] {
    const references: ContextReference[] = [];

    const latestEntity =
      entities.length > 0
        ? entities[entities.length - 1]
        : null;

    for (const message of messages) {
      const normalized =
        this.normalize(message.content);

      if (
        normalized.includes('il ') ||
        normalized.includes('elle ')
      ) {
        references.push({
          value: this.findPronoun(
            normalized,
          ),
          resolvedTo:
            latestEntity?.value ?? null,
          type: 'pronoun',
          confidence:
            latestEntity ? 0.8 : 0,
        });
      }

      if (
        normalized.includes('ce projet') ||
        normalized.includes('cette idee') ||
        normalized.includes('ca ') ||
        normalized.includes('cela ')
      ) {
        references.push({
          value: 'reference',
          resolvedTo:
            latestEntity?.value ?? null,
          type: 'demonstrative',
          confidence:
            latestEntity ? 0.75 : 0,
        });
      }
    }

    return references;
  }

  private findPronoun(
    message: string,
  ): string {
    if (message.includes('elle ')) {
      return 'elle';
    }

    return 'il';
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
      .replace(/\s+/g, ' ')
      .trim();
  }
}