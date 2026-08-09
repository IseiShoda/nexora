import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { MemoryService } from '../memory/services/memory.service';
import { BrainService } from '../brain/services/brain.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memoryService: MemoryService,
    private readonly brainService: BrainService,
  ) {}

  async sendMessage(
    message: string,
    conversationId?: number,
  ) {
    let conversation;

    if (conversationId) {
      conversation =
        await this.prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
        });

      if (!conversation) {
        throw new Error(
          'Conversation introuvable',
        );
      }
    } else {
      conversation =
        await this.prisma.conversation.create({
          data: {
            title: message.substring(0, 50),
          },
        });
    }

    await this.prisma.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId: conversation.id,
      },
    });

    await this.memoryService.processMessage(
      message,
    );

    const answer =
      await this.brainService.think(
        message,
        conversation.id,
      );

    await this.prisma.message.create({
      data: {
        role: 'nexora',
        content: answer,
        conversationId: conversation.id,
      },
    });

    const history =
      await this.prisma.message.findMany({
        where: {
          conversationId: conversation.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return {
      conversationId: conversation.id,
      answer,
      history,
      timestamp:
        new Date().toISOString(),
    };
  }

  async getHistory() {
    return this.prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}