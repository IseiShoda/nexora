import { Injectable } from '@nestjs/common';

type Message = {
  role: 'user' | 'nexora';
  content: string;
};

@Injectable()
export class ChatService {
  private messages: Message[] = [];

  sendMessage(message: string) {
    this.messages.push({
      role: 'user',
      content: message,
    });

    const answer = this.generateResponse(message);

    this.messages.push({
      role: 'nexora',
      content: answer,
    });

    return {
      answer,
      history: this.messages,
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
      return 'Je peux discuter avec vous, conserver le contexte de notre conversation et, progressivement, apprendre à comprendre votre entreprise.';
    }

    return `J'ai bien reçu votre message : "${message}". Je suis encore en phase d'apprentissage, mais ma mémoire commence à fonctionner. 🧠`;
  }

  getHistory() {
    return this.messages;
  }
}