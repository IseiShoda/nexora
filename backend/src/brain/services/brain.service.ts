import { Injectable } from '@nestjs/common';

import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';
import { ConversationContext } from '../../context/interfaces/context.interface';

import { RequirementService } from '../../requirements/requirement.service';

import { ReasoningService } from '../../reasoning/services/reasoning.service';
import { ReasoningResult } from '../../reasoning/interfaces/reasoning.interface';

import { CognitiveCoreService } from '../../core/cognitive/cognitive-core.service';

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
    private readonly reasoningService: ReasoningService,
    private readonly cognitiveCoreService: CognitiveCoreService,
  ) {}

  async think(
    message: string,
    conversationId: number,
  ): Promise<string> {

    /*
     * =========================================================
     * 0. COGNITIVE CORE — SHADOW MODE
     * =========================================================
     *
     * Le Cognitive Core entre maintenant dans le flux réel
     * du Brain.
     *
     * Pour cette étape, il n'est pas encore responsable
     * de la réponse finale.
     *
     * Le pipeline historique continue donc à fonctionner
     * normalement après cette analyse.
     */

    const cognitiveOutput =
      await this.cognitiveCoreService.process({
        message,
        conversationId: String(conversationId),
      });

    console.log(
      '[BRAIN] Cognitive Core:',
      cognitiveOutput,
    );

    /*
     * =========================================================
     * 1. INTENT
     * =========================================================
     */

    const detected =
      this.intentService.detect(message);

    /*
     * =========================================================
     * 2. CONTEXT
     * =========================================================
     */

    const context =
      await this.contextService.getContext(
        conversationId,
      );

    /*
     * =========================================================
     * 3. REASONING
     * =========================================================
     */

    const reasoning =
      this.reasoningService.analyze(
        message,
        context.activeTopic,
        context,
      );

    /*
     * =========================================================
     * 4. DECISION
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
      '[REASONING] Result:',
      reasoning,
    );

    console.log(
      '[BRAIN] Decision:',
      decision,
    );

    /*
     * =========================================================
     * 5. ACTION
     * =========================================================
     */

    switch (decision.action) {
      case BrainAction.ANSWER:
        return this.handleIntent(
          detected.intent,
          message,
          context,
          reasoning,
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
    reasoning: ReasoningResult,
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
          reasoning,
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
   * IDENTITÉ
   * =========================================================
   */

  private handleIdentity(): string {
    return 'Je suis Nexora, une intelligence conçue pour devenir votre copilote.';
  }

  /*
   * =========================================================
   * NOM UTILISATEUR
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
   * PROJET
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
   * PROJECT REQUIREMENT
   * =========================================================
   */

  private async handleProjectRequirement(
    message: string,
    context: ConversationContext,
    reasoning: ReasoningResult,
  ): Promise<string> {
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

    if (!project) {
      return `Je comprends cette exigence : "${message}", mais je ne sais pas encore à quel projet elle se rapporte.`;
    }

    const requirement =
      this.cleanRequirement(message);

    if (!requirement) {
      return "Je comprends l'exigence, mais son contenu semble vide.";
    }

    /*
     * =======================================================
     * ENREGISTREMENT
     * =======================================================
     */

    const saved =
      await this.requirementService.addRequirement(
        project,
        requirement,
      );

    if (!saved) {
      return "Je n'ai pas pu enregistrer cette exigence.";
    }

    /*
     * =======================================================
     * RÉPONSE ENRICHIE PAR LE REASONING
     * =======================================================
     */

    return this.buildRequirementResponse(
      project,
      requirement,
      reasoning,
    );
  }

  /*
   * =========================================================
   * REQUIREMENT RESPONSE
   * =========================================================
   */

  private buildRequirementResponse(
    project: string,
    requirement: string,
    reasoning: ReasoningResult,
  ): string {
    const response: string[] = [];

    response.push(
      `J'ai enregistré cette exigence pour "${project}" : "${requirement}". 🧠`,
    );

    /*
     * ---------------------------------------------------------
     * INFERENCE
     * ---------------------------------------------------------
     */

    if (reasoning.inferences.length > 0) {
      response.push('');
      response.push('Ce que j\'en déduis :');

      for (const inference of reasoning.inferences) {
        response.push(
          `• ${inference.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * IMPLICATIONS
     * ---------------------------------------------------------
     */

    if (reasoning.implications.length > 0) {
      response.push('');
      response.push('Implications identifiées :');

      for (const implication of reasoning.implications) {
        response.push(
          `• ${implication.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * UNKNOWN
     * ---------------------------------------------------------
     */

    if (reasoning.unknowns.length > 0) {
      response.push('');
      response.push('Point encore à préciser :');

      for (const unknown of reasoning.unknowns) {
        response.push(
          `• ${unknown.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * QUESTION
     * ---------------------------------------------------------
     */

    if (reasoning.questions.length > 0) {
      response.push('');
      response.push(
        `Question : ${reasoning.questions[0]}`,
      );
    }

    return response.join('\n');
  }

  /*
   * =========================================================
   * PROJECT REQUIREMENTS QUERY
   * =========================================================
   */

  private async handleProjectRequirementsQuery(
    context: ConversationContext,
  ): Promise<string> {
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

    if (!project) {
      return "Je peux te donner les exigences, mais je ne sais pas encore pour quel projet.";
    }

    const requirements =
      await this.requirementService.getRequirements(
        project,
      );

    if (requirements.length === 0) {
      return `Je n'ai encore aucune exigence enregistrée pour "${project}".`;
    }

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
   * CLEAN REQUIREMENT
   * =========================================================
   */

  private cleanRequirement(
    message: string,
  ): string {
    let requirement = message.trim();

    /*
     * Supprime les pronoms / connecteurs utilisés
     * lorsqu'une exigence fait référence au projet.
     *
     * Exemples :
     *
     * "Il devra supporter 100 000 utilisateurs"
     * -> "devra supporter 100 000 utilisateurs"
     *
     * "Et il devra rester rapide"
     * -> "devra rester rapide"
     *
     * "Elle doit être sécurisée"
     * -> "doit être sécurisée"
     */

    requirement = requirement.replace(
      /^(et\s+)?(il|elle|ça|cela)\s+/i,
      '',
    );

    /*
     * Supprime "que" en début de phrase.
     */

    requirement = requirement.replace(
      /^que\s+/i,
      '',
    );

    /*
     * Nettoyage des espaces.
     */

    requirement = requirement
      .replace(/\s+/g, ' ')
      .trim();

    return requirement;
  }

  /*
   * =========================================================
   * CONTEXTUAL RESPONSE
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

    if (reference) {
      return `Je comprends que "${reference.value}" fait référence à ${reference.resolvedTo}. 🧠`;
    }

    if (context.activeTopic) {
      return `Je garde le contexte autour de "${context.activeTopic}". Tu viens de me dire : "${message}". 🧠`;
    }

    return `J'ai bien reçu ton message : "${message}".`;
  }

  /*
   * =========================================================
   * CLARIFICATION
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