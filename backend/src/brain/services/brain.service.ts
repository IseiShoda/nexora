import { Injectable } from '@nestjs/common';

import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';
import { ConversationContext } from '../../context/interfaces/context.interface';

import { RequirementService } from '../../requirements/requirement.service';

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
    private readonly requirementService: RequirementService,
  ) {}

  async think(
    message: string,
    conversationId: number,
  ): Promise<string> {
    /*
     * =========================================================
     * 1. DÉTECTION DE L'INTENTION
     * =========================================================
     */
    const detected =
      this.intentService.detect(message);

    /*
     * =========================================================
     * 2. CONSTRUCTION DU CONTEXTE
     * =========================================================
     */
    const context =
      await this.contextService.getContext(
        conversationId,
      );

    /*
     * =========================================================
     * 3. DÉCISION DU CERVEAU
     * =========================================================
     */
    const decision =
      this.decisionService.decide(
        detected.intent,
        detected.confidence,
        context,
      );

    console.log(
      '[BRAIN] Intent:',
      detected,
    );

    console.log(
      '[BRAIN] Decision:',
      decision,
    );

    /*
     * =========================================================
     * 4. EXÉCUTION DE L'ACTION
     * =========================================================
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

      case BrainIntent.PROJECT_REQUIREMENTS_QUERY:
        return this.handleProjectRequirementsQuery(
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
   * AJOUT D'UNE EXIGENCE
   * =========================================================
   */
  private async handleProjectRequirement(
    message: string,
    context: ConversationContext,
  ): Promise<string> {
    /*
     * Recherche d'une référence résolue.
     *
     * Exemple :
     *
     * "Il doit être rapidement scalable"
     *
     * "il" → Chrono Solar
     */
    const reference =
      context.references.find(
        (item) =>
          item.resolvedTo !== null,
      );

    let project: string | null = null;

    if (reference) {
      project = reference.resolvedTo;
    } else if (context.activeTopic) {
      project = context.activeTopic;
    }

    /*
     * Si aucun projet n'est disponible,
     * on ne peut pas enregistrer proprement
     * l'exigence.
     */
    if (!project) {
      return `Je comprends cette exigence : "${message}", mais je ne sais pas encore à quel projet elle se rapporte.`;
    }

    /*
     * Nettoyage léger du texte enregistré.
     *
     * "Il doit être rapidement scalable"
     *
     * devient :
     *
     * "doit être rapidement scalable"
     *
     * afin d'éviter de stocker le pronom "Il"
     * comme faisant partie de l'exigence.
     */
    const requirement =
      this.cleanRequirement(
        message,
      );

    if (!requirement) {
      return 'Je comprends l\'exigence, mais son contenu semble vide.';
    }

    /*
     * Enregistrement dans SQLite via Prisma.
     */
    const saved =
      await this.requirementService.addRequirement(
        project,
        requirement,
      );

    if (!saved) {
      return 'Je n\'ai pas pu enregistrer cette exigence.';
    }

    return `J'ai enregistré cette exigence pour "${project}" : "${requirement}". 🧠`;
  }

  /*
   * =========================================================
   * CONSULTATION DES EXIGENCES
   * =========================================================
   */
  private async handleProjectRequirementsQuery(
    context: ConversationContext,
  ): Promise<string> {
    /*
     * Détermination du projet courant.
     */
    const reference =
      context.references.find(
        (item) =>
          item.resolvedTo !== null,
      );

    let project: string | null = null;

    if (reference) {
      project = reference.resolvedTo;
    } else if (context.activeTopic) {
      project = context.activeTopic;
    }

    /*
     * Aucun projet identifié.
     */
    if (!project) {
      return "Je peux te donner les exigences, mais je ne sais pas encore pour quel projet.";
    }

    /*
     * Lecture des exigences depuis SQLite.
     */
    const requirements =
      await this.requirementService.getRequirements(
        project,
      );

    /*
     * Aucune exigence enregistrée.
     */
    if (requirements.length === 0) {
      return `Je n'ai encore aucune exigence enregistrée pour "${project}".`;
    }

    /*
     * Construction de la réponse.
     */
    const lines =
      requirements.map(
        (item, index) =>
          `${index + 1}. ${item.requirement}`,
      );

    return [
      `Voici les exigences actuellement enregistrées pour "${project}" :`,
      '',
      ...lines,
      '',
      `Total : ${requirements.length} exigence(s). 🧠`,
    ].join('\n');
  }

  /*
   * =========================================================
   * NETTOYAGE D'UNE EXIGENCE
   * =========================================================
   */
  private cleanRequirement(
    message: string,
  ): string {
    let requirement =
      message.trim();

    /*
     * Suppression des pronoms faisant référence
     * au projet courant.
     *
     * Exemple :
     *
     * "Il doit être rapidement scalable"
     *
     * devient :
     *
     * "doit être rapidement scalable"
     */
    requirement =
      requirement.replace(
        /^(il|elle|ça|cela)\s+/i,
        '',
      );

    /*
     * Suppression éventuelle de "que"
     * après certains débuts de phrase.
     */
    requirement =
      requirement.replace(
        /^que\s+/i,
        '',
      );

    return requirement.trim();
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
    const reference =
      context.references.find(
        (item) =>
          item.resolvedTo !== null,
      );

    /*
     * Priorité à une référence résolue.
     */
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