import { Body, Controller, Post } from '@nestjs/common';

@Controller('chat')
export class ChatController {

  @Post()
  sendMessage(@Body() body: { message: string }) {

    return {
      answer: `Bonjour, je suis Nexora. J'ai reçu : "${body.message}"`,
      timestamp: new Date(),
    };

  }

}