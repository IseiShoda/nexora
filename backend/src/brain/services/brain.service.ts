import { Injectable } from '@nestjs/common';

import { MemoryService } from '../../memory/services/memory.service';
import { ContextService } from '../../context/services/context.service';
import { ConversationContext } from '../../context/interfaces/context.interface';

import { RequirementService } from '../../requirements/requirement.service';

import { ReasoningService } from '../../reasoning/services/reasoning.service';
import { ReasoningResult } from '../../reasoning/interfaces/reasoning.interface';

import { CognitiveCoreService } from '../../core/cognitive/cognitive-core.service';
import { ExecutionPlan } from '../../core/cognitive/cognitive-core.types';

import { IntentService } from '../intents/intent.service';
import { BrainIntent } from '../intents/intent.interface';

@Injectable()
export class BrainService {
  constructor(
    private readonly intentService: IntentService,
    private readonly memoryService: MemoryService,
    private readonly contextService: ContextService,
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
     * 0. COGNITIVE CORE
     * =========================================================
     *
     * Le Cognitive Core est la source de la décision
     * d'exécution.
     *
     * Cognitive Core
     *      ↓
     * ExecutionPlan
     *      ↓
     * BrainService
     *      ↓
     * Execution
     */

    const cognitiveOutput =
      await this.cognitiveCoreService.process({
        message,
        conversationId: String(conversationId),
      });

    const execution =
      cognitiveOutput.execution;

    console.log(
      '[BRAIN] Cognitive Core:',
      cognitiveOutput,
    );

    console.log(
      '[BRAIN] Execution Plan:',
      execution,
    );

    /*
     * =========================================================
     * 1. CONTEXT
     * =========================================================
     */

    const context =
      await this.contextService.getContext(
        conversationId,
      );

    /*
     * =========================================================
     * 2. REASONING
     * =========================================================
     *
     * Le Reasoning produit l'analyse structurée utilisée
     * par les handlers du Brain.
     *
     * Le Cognitive Core reste responsable de la décision.
     */

    const reasoning =
      this.reasoningService.analyze(
        message,
        context.activeTopic,
        context,
      );

    console.log(
      '[REASONING] Result:',
      reasoning,
    );

    /*
     * =========================================================
     * 3. EXECUTION
     * =========================================================
     */

    return this.executeCognitivePlan(
      execution,
      message,
      context,
      reasoning,
    );
  }

  /*
   * =========================================================
   * COGNITIVE EXECUTION
   * =========================================================
   */

  private async executeCognitivePlan(
    execution: ExecutionPlan,
    message: string,
    context: ConversationContext,
    reasoning: ReasoningResult,
  ): Promise<string> {
    console.log(
      `[BRAIN] Executing strategy: ${execution.strategy}`,
    );

    console.log(
      `[BRAIN] Execution authority: ${execution.authority}`,
    );

    /*
     * =======================================================
     * ANSWER
     * =======================================================
     */

    if (execution.action === 'ANSWER') {
      return this.executeAnswer(
        execution,
        message,
        context,
        reasoning,
      );
    }

    /*
     * =======================================================
     * CONTINUE CONTEXT
     * =======================================================
     */

    if (execution.action === 'CONTINUE_CONTEXT') {
      return this.handleContextualResponse(
        message,
        context,
      );
    }

    /*
     * =======================================================
     * ASK CLARIFICATION
     * =======================================================
     */

    if (execution.action === 'ASK_CLARIFICATION') {
      return this.handleClarification(
        message,
        context,
      );
    }

    /*
     * =======================================================
     * FALLBACK
     * =======================================================
     */

    return this.handleContextualResponse(
      message,
      context,
    );
  }

  /*
   * =========================================================
   * ANSWER EXECUTION
   * =========================================================
   */

  private async executeAnswer(
    execution: ExecutionPlan,
    message: string,
    context: ConversationContext,
    reasoning: ReasoningResult,
  ): Promise<string> {
    switch (execution.strategy) {
      /*
       * -------------------------------------------------------
       * QUESTION
       * -------------------------------------------------------
       *
       * Le Cognitive Core sait qu'il s'agit d'une question.
       *
       * Le Brain utilise maintenant le ReasoningResult pour
       * construire une réponse structurée.
       */

      case 'ANSWER_QUESTION':
        console.log(
          '[BRAIN] Execution: ANSWER_QUESTION',
        );

        return this.handleQuestion(
          message,
          context,
          reasoning,
        );

      /*
       * -------------------------------------------------------
       * INTENT
       * -------------------------------------------------------
       */

      case 'ANSWER_INTENT':
        console.log(
          '[BRAIN] Execution: ANSWER_INTENT',
        );

        return this.handleIntent(
          execution.intent as BrainIntent,
          message,
          context,
          reasoning,
        );

      /*
       * -------------------------------------------------------
       * FALLBACK
       * -------------------------------------------------------
       */

      default:
        return this.handleIntent(
          execution.intent as BrainIntent,
          message,
          context,
          reasoning,
        );
    }
  }

  /*
   * =========================================================
   * QUESTION
   * =========================================================
   *
   * Le Brain ne répond plus simplement :
   *
   * "J'ai identifié ta question..."
   *
   * Il consomme maintenant les éléments produits par
   * le moteur de raisonnement :
   *
   * - facts
   * - inferences
   * - implications
   * - dependencies
   * - unknowns
   * - questions
   */

  private handleQuestion(
    message: string,
    context: ConversationContext,
    reasoning: ReasoningResult,
  ): string {
    const response: string[] = [];

    /*
     * ---------------------------------------------------------
     * CONTEXTE
     * ---------------------------------------------------------
     */

    if (context.activeTopic) {
      response.push(
        `Ta question concerne "${context.activeTopic}".`,
      );
    } else {
      response.push(
        "J'ai analysé ta question.",
      );
    }

    /*
     * ---------------------------------------------------------
     * FACTS
     * ---------------------------------------------------------
     */

    if (reasoning.facts.length > 0) {
      response.push('');
      response.push('Ce que je sais :');

      for (const fact of reasoning.facts) {
        response.push(
          `• ${fact.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * INFERENCES
     * ---------------------------------------------------------
     */

    if (reasoning.inferences.length > 0) {
      response.push('');
      response.push("Ce que j'en déduis :");

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
      response.push(
        'Implications identifiées :',
      );

      for (const implication of reasoning.implications) {
        response.push(
          `• ${implication.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * DEPENDENCIES
     * ---------------------------------------------------------
     */

    if (reasoning.dependencies.length > 0) {
      response.push('');
      response.push(
        'Domaines concernés :',
      );

      for (const dependency of reasoning.dependencies) {
        response.push(
          `• ${dependency.content}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * UNKNOWNS
     * ---------------------------------------------------------
     */

    if (reasoning.unknowns.length > 0) {
      response.push('');
      response.push(
        'Points encore inconnus :',
      );

      for (const unknown of reasoning.unknowns) {
        response.push(
          `• ${unknown.content} — ${unknown.reason}`,
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * QUESTION ANALYSÉE
     * ---------------------------------------------------------
     */

    if (reasoning.questions.length > 0) {
      response.push('');
      response.push(
        `Question analysée : "${reasoning.questions[0]}"`,
      );
    }

    /*
     * ---------------------------------------------------------
     * FALLBACK
     * ---------------------------------------------------------
     *
     * Si le raisonnement ne contient aucun élément exploitable,
     * on conserve le comportement précédent.
     */

    if (
      reasoning.facts.length === 0 &&
      reasoning.inferences.length === 0 &&
      reasoning.implications.length === 0 &&
      reasoning.dependencies.length === 0 &&
      reasoning.unknowns.length === 0
    ) {
      response.push('');
      response.push(
        `J'ai identifié ta question : "${message}".`,
      );
    }

    return response.join('\n');
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

      case BrainIntent.QUESTION:
        return this.handleQuestion(
          message,
          context,
          reasoning,
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
      response.push("Ce que j'en déduis :");

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
      response.push(
        'Implications identifiées :',
      );

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
      response.push(
        'Point encore à préciser:',
      );

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