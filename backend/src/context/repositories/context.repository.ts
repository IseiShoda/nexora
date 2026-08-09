import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import { ContextMessage } from '../interfaces/context.interface';

@Injectable()
export class ContextRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getMessages(
    conversationId: number,
    limit = 20,
  ): Promise<ContextMessage[]> {
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

    return messages.reverse().map(
      (message) => ({
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      }),
    );
  }
}