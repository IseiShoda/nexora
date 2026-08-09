import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(message: string) {
    const conversation = await this.prisma.conversation.create({
      data: {
        title: message.substring(0, 50),
      },
    });

    await this.prisma.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId: conversation.id,
      },
    });

    const answer = this.generateResponse(message);

    await this.prisma.message.create({
      data: {
        role: 'nexora',
        content: answer,
        conversationId: conversation.id,
      },
    });

    const history = await this.prisma.message.findMany({
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
      timestamp: new Date().toISOString(),
    };
  }

  private generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('bonjour') ||
      lowerMessage.includes('salut')
    ) {
      return 'Bonjour 👋 Je suis Nexora. Comment puis-je vous aider ?';
    }

    if (lowerMessage.includes('qui es-tu')) {
      return 'Je suis Nexora, une intelligence conçue pour devenir le copilote de votre entreprise.';
    }

    if (lowerMessage.includes('que peux-tu faire')) {
      return 'Je peux discuter avec vous, mémoriser nos conversations et progressivement apprendre à comprendre votre entreprise.';
    }

    return `J'ai bien reçu votre message : "${message}". Cette conversation est maintenant mémorisée. 🧠`;
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