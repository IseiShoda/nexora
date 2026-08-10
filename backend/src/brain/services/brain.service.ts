import { Injectable } from '@nestjs/common';

import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';
import { ConversationContext } from '../../context/interfaces/context.interface';

import { IntentService } from '../intents/intent.service';
import { BrainIntent } from '../intents/intent.interface';

import { BrainAction } from '../decisions/brain-decision.interface';
import { BrainDecisionService } from '../decisions/brain-decision.service';

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
    /*
     * 1. Détection de l'intention
     */
    const detected =
      this.intentService.detect(message);

    /*
     * 2. Construction du contexte
     */
    const context =
      await this.contextService.getContext(
        conversationId,
      );

    /*
     * 3. Décision du cerveau
     */
    const decision =
  this.decisionService.decide(
    detected.intent,
    detected.confidence,
    context,
  );

console.log('[BRAIN] Intent:', detected);
console.log('[BRAIN] Decision:', decision);

    /*
     * 4. Exécution de l'action décidée
     */
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

  /*
   * =========================================================
   * INTENTS
   * =========================================================
   */

  private async handleIntent(
    intent: BrainIntent,
    message: string,
    context: ConversationContext,
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

      case BrainIntent.PROJECT_REQUIREMENT:
        return this.handleProjectRequirement(
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

  /*
   * =========================================================
   * GREETING
   * =========================================================
   */

  private handleGreeting(): string {
    return 'Bonjour 👋 Je suis Nexora. Comment puis-je vous aider ?';
  }

  /*
   * =========================================================
   * IDENTITÉ DE NEXORA
   * =========================================================
   */

  private handleIdentity(): string {
    return 'Je suis Nexora, une intelligence conçue pour devenir votre copilote.';
  }

  /*
   * =========================================================
   * NOM DE L'UTILISATEUR
   * =========================================================
   */

  private async handleUserName(): Promise<string> {
    const userName =
      await this.memoryService.get('name');

    if (!userName) {
      return "Tu ne m'as pas encore indiqué ton prénom.";
    }

    return `Tu t'appelles ${userName.value}. 🧠`;
  }

  /*
   * =========================================================
   * PROJET COURANT
   * =========================================================
   */

  private async handleUserProject(): Promise<string> {
    const project =
      await this.memoryService.getCurrentProject();

    if (!project) {
      return "Je n'ai pas encore de projet enregistré dans ma mémoire.";
    }

    return `Ton projet actuel est ${project}. 🧠`;
  }

  /*
   * =========================================================
   * EXIGENCE / BESOIN LIÉ AU PROJET
   * =========================================================
   */

  private handleProjectRequirement(
    message: string,
    context: ConversationContext,
  ): string {
    /*
     * Une référence explicite comme :
     *
     * "Il doit être rapidement scalable"
     *
     * doit être résolue vers l'entité
     * déterminée par le contexte.
     */

    const reference =
      context.references.find(
        (item) =>
          item.resolvedTo !== null,
      );

    if (reference) {
      return `Je comprends que "${reference.value}" fait référence à ${reference.resolvedTo}. Je retiens également cette exigence : "${message}". 🧠`;
    }

    /*
     * Si aucune référence explicite n'est trouvée,
     * on utilise le sujet actif.
     */

    if (context.activeTopic) {
      return `Je comprends que cette exigence concerne "${context.activeTopic}" : "${message}". 🧠`;
    }

    /*
     * Dernier recours.
     */

    return `Je comprends cette exigence : "${message}". 🧠`;
  }

  /*
   * =========================================================
   * RÉPONSE CONTEXTUELLE
   * =========================================================
   */

  private handleContextualResponse(
    message: string,
    context: ConversationContext,
  ): string {
    /*
     * Priorité à une référence résolue.
     */

    const reference =
      context.references.find(
        (item) =>
          item.resolvedTo !== null,
      );

    if (reference) {
      return `Je comprends que "${reference.value}" fait référence à ${reference.resolvedTo}. 🧠`;
    }

    /*
     * Sinon, conserver le sujet actif.
     */

    if (context.activeTopic) {
      return `Je garde le contexte autour de "${context.activeTopic}". Tu viens de me dire : "${message}". 🧠`;
    }

    /*
     * Aucun contexte exploitable.
     */

    return `J'ai bien reçu ton message : "${message}".`;
  }

  /*
   * =========================================================
   * DEMANDE DE CLARIFICATION
   * =========================================================
   */

  private handleClarification(
    message: string,
    context: ConversationContext,
  ): string {
    if (context.activeTopic) {
      return `Je comprends que nous parlons de "${context.activeTopic}", mais j'ai besoin d'un peu plus de précision pour avancer.`;
    }

    return `Je veux bien avancer avec toi, mais peux-tu préciser ce que tu souhaites faire avec : "${message}" ?`;
  }
}