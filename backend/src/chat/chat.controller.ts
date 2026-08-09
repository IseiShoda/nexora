import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body()
    body: {
      message: string;
      conversationId?: number | string;
    },
  ) {
    const conversationId =
      body.conversationId !== undefined
        ? Number(body.conversationId)
        : undefined;

    return this.chatService.sendMessage(
      body.message,
      conversationId,
    );
  }

  @Get('history')
  async getHistory() {
    return this.chatService.getHistory();
  }
}