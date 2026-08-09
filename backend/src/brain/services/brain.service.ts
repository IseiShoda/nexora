import { Injectable } from '@nestjs/common';
import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';
import { IntentService } from '../intents/intent.service';
import { BrainIntent } from '../intents/intent.interface';

@Injectable()
export class BrainService {
  constructor(
    private readonly intentService: IntentService,
    private readonly memoryService: MemoryService,
    private readonly contextService: ContextService,
  ) {}

  async think(
    message: string,
    conversationId: number,
  ): Promise<string> {
    const detected =
      this.intentService.detect(message);

    const context =
      await this.contextService.getContext(
        conversationId,
      );

    switch (detected.intent) {
      case BrainIntent.GREETING:
        return this.handleGreeting();

      case BrainIntent.NEXORA_IDENTITY:
        return this.handleIdentity();

      case BrainIntent.USER_NAME:
        return this.handleUserName();

      case BrainIntent.USER_PROJECT:
        return this.handleUserProject();

      default:
        return this.handleContextualResponse(
          message,
          context,
        );
    }
  }

  private handleGreeting(): string {
    return 'Bonjour 👋 Je suis Nexora. Comment puis-je vous aider ?';
  }

  private handleIdentity(): string {
    return 'Je suis Nexora, une intelligence conçue pour devenir votre copilote.';
  }

  private async handleUserName(): Promise<string> {
    const userName =
      await this.memoryService.get('name');

    if (!userName) {
      return "Tu ne m'as pas encore indiqué ton prénom.";
    }

    return `Tu t'appelles ${userName.value}. 🧠`;
  }

  private async handleUserProject(): Promise<string> {
    const project =
      await this.memoryService.get('project');

    if (!project) {
      return "Je n'ai pas encore de projet enregistré dans ma mémoire.";
    }

    return `Ton projet actuel est ${project.value}. 🧠`;
  }

  private handleContextualResponse(
    message: string,
    context: any,
  ): string {
    const reference =
      context.references.find(
        (item: any) =>
          item.resolvedTo !== null,
      );

    if (reference) {
      return `Je comprends que "${reference.value}" fait référence à ${reference.resolvedTo}. 🧠`;
    }

    if (context.activeTopic) {
      return `Je garde le contexte autour de "${context.activeTopic}". Tu viens de me dire : "${message}". 🧠`;
    }

    return `J'ai bien reçu ton message : "${message}".`;
  }
}