import { Injectable } from '@nestjs/common';

import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';

import { IntentService } from '../intents/intent.service';
import { BrainIntent } from '../intents/intent.interface';

import {
  BrainAction,
} from '../decisions/brain-decision.interface';

import {
  BrainDecisionService,
} from '../decisions/brain-decision.service';

@Injectable()
export class BrainService {
  constructor(
    private readonly intentService: IntentService,
    private readonly memoryService: MemoryService,
    private readonly contextService: ContextService,
    private readonly decisionService: BrainDecisionService,
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

    const decision =
      this.decisionService.decide(
        detected.intent,
        detected.confidence,
        context,
      );

    switch (decision.action) {
      case BrainAction.ANSWER:
        return this.handleIntent(
          detected.intent,
          message,
          context,
        );

      case BrainAction.CONTINUE_CONTEXT:
        return this.handleContextualResponse(
          message,
          context,
        );

      case BrainAction.ASK_CLARIFICATION:
        return this.handleClarification(
          message,
          context,
        );

      default:
        return this.handleContextualResponse(
          message,
          context,
        );
    }
  }

  private async handleIntent(
    intent: BrainIntent,
    message: string,
    context: any,
  ): Promise<string> {
    switch (intent) {
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

  private handleClarification(
    message: string,
    context: any,
  ): string {
    if (context.activeTopic) {
      return `Je comprends que nous parlons de "${context.activeTopic}", mais j'ai besoin d'un peu plus de précision pour avancer.`;
    }

    return `Je veux bien avancer avec toi, mais peux-tu préciser ce que tu souhaites faire avec : "${message}" ?`;
  }
}