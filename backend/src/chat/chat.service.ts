import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { MemoryService } from '../memory/services/memory.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memoryService: MemoryService,
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

    const previousMessages =
      await this.prisma.message.findMany({
        where: {
          conversationId: conversation.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    // La mémoire est maintenant gérée
    // par MemoryService.
    await this.memoryService.processMessage(
      message,
    );

    const answer =
      await this.generateResponse(
        message,
        previousMessages,
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

  private async generateResponse(
    message: string,
    previousMessages: any[],
  ): Promise<string> {
    const normalizedMessage =
      this.normalize(message);

    // Salutations
    if (
      normalizedMessage.includes(
        'bonjour',
      ) ||
      normalizedMessage.includes(
        'salut',
      )
    ) {
      return 'Bonjour 👋 Je suis Nexora. Comment puis-je vous aider ?';
    }

    // Identité de Nexora
    if (
      normalizedMessage.includes(
        'qui es-tu',
      ) ||
      normalizedMessage.includes(
        'qui es tu',
      )
    ) {
      return 'Je suis Nexora, une intelligence conçue pour devenir votre copilote.';
    }

    // Recherche du prénom dans la mémoire.
    const asksForName =
      normalizedMessage.includes(
        'quel est mon nom',
      ) ||
      normalizedMessage.includes(
        'quel est mon prenom',
      ) ||
      normalizedMessage.includes(
        'quel est mon pren',
      ) ||
      (
        normalizedMessage.includes('mon') &&
        (
          normalizedMessage.includes(
            'prenom',
          ) ||
          normalizedMessage.includes(
            'prénom',
          ) ||
          normalizedMessage.includes(
            'nom',
          )
        )
      ) ||
      normalizedMessage.includes(
        'comment je m appelle',
      ) ||
      normalizedMessage.includes(
        'comment je mappelle',
      );

    if (asksForName) {
      const userName =
        await this.memoryService.getUserName();

      if (userName) {
        return `Tu t'appelles ${userName}. 🧠`;
      }

      return "Tu ne m'as pas encore indiqué ton prénom.";
    }

    // Contexte actuel de la conversation.
    if (previousMessages.length > 1) {
      return `Je me souviens de notre conversation. Tu viens de me dire : "${message}" 🧠`;
    }

    return `J'ai bien reçu ton message : "${message}".`;
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

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}