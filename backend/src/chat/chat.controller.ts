import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  sendMessage(@Body('message') message: string) {
    return this.chatService.sendMessage(message);
  }

  @Get('history')
  getHistory() {
    return this.chatService.getHistory();
  }
}