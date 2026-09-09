import { Injectable, Logger } from '@nestjs/common';

import {
  CognitiveInput,
  CognitiveOutput,
  Understanding,
  Reasoning,
  Decision,
  ExecutionPlan,
  CognitiveExecutionStrategy,
} from './cognitive-core.types';

import {
  BrainIntent,
} from '../../brain/intents/intent.interface';

import { IntentService } from '../../brain/intents/intent.service';

import {
  BrainDecisionService,
} from '../../brain/decisions/brain-decision.service';

import {
  ContextService,
} from '../../context/services/context.service';

import {
  ConversationContext,
} from '../../context/interfaces/context.interface';

import {
  ReasoningService,
} from '../../reasoning/services/reasoning.service';

@Injectable()
export class CognitiveCoreService {
  private readonly logger = new Logger(
    CognitiveCoreService.name,
  );

  constructor(
    private readonly intentService: IntentService,

    private readonly contextService: ContextService,

    private readonly reasoningService: ReasoningService,

    private readonly decisionService: BrainDecisionService,
  ) {}

  async process(
    input: CognitiveInput,
  ): Promise<CognitiveOutput> {
    const message = input.message.trim();

    this.logger.log(
      `[COGNITIVE] Input: "${message}"`,
    );

    /*
     * =========================================================
     * 1. CONTEXT
     * =========================================================
     */

    const context = input.conversationId
      ? await this.contextService.getContext(
          Number(input.conversationId),
        )
      : null;

    /*
     * =========================================================
     * 2. INITIAL UNDERSTANDING
     * =========================================================
     */

    const detected =
      this.intentService.detect(message);

    this.logger.log(
      `[COGNITIVE] Initial intent: ${detected.intent}`,
    );

    /*
     * =========================================================
     * 3. REASONING
     * =========================================================
     */

    const reasoningResult =
      this.reasoningService.analyze(
        message,
        context?.activeTopic ?? null,
        context ?? undefined,
      );

    const reasoning: Reasoning = {
      type: reasoningResult.type,

      facts: reasoningResult.facts.map(
        (item) => this.serialize(item),
      ),

      inferences: reasoningResult.inferences.map(
        (item) => this.serialize(item),
      ),

      unknowns: reasoningResult.unknowns.map(
        (item) => this.serialize(item),
      ),

      implications: reasoningResult.implications.map(
        (item) => this.serialize(item),
      ),

      dependencies: reasoningResult.dependencies.map(
        (item) => this.serialize(item),
      ),

      questions: reasoningResult.questions,
    };

    /*
     * =========================================================
     * 4. COGNITIVE ARBITRATION
     * =========================================================
     *
     * IntentService fournit une première interprétation.
     *
     * ReasoningService fournit une analyse plus profonde.
     *
     * Le Cognitive Core arbitre entre les deux.
     */

    const finalUnderstanding =
      this.resolveUnderstanding(
        detected,
        reasoning,
        context,
      );

    /*
     * =========================================================
     * 5. DECISION
     * =========================================================
     */

    const decision =
      this.buildDecision(
        detected,
        finalUnderstanding,
        context,
      );

    /*
     * =========================================================
     * 6. EXECUTION PLAN
     * =========================================================
     *
     * Le Cognitive Core transforme sa décision
     * abstraite en directive d'exécution explicite.
     *
     * IMPORTANT :
     * Le Cognitive Core est maintenant l'autorité
     * de la décision et du plan d'exécution.
     *
     * BrainService reste responsable de l'exécution
     * physique des handlers existants.
     */

    const execution =
      this.buildExecutionPlan(
        decision,
        finalUnderstanding,
        reasoning,
      );

    /*
     * =========================================================
     * 7. FINAL OUTPUT
     * =========================================================
     */

    const output: CognitiveOutput = {
      input,

      understanding: finalUnderstanding,

      reasoning,

      decision,

      execution,
    };

    this.logger.log(
      `[COGNITIVE] Final intent: ${finalUnderstanding.intent}`,
    );

    this.logger.log(
      `[COGNITIVE] Decision: ${decision.action}`,
    );

    this.logger.log(
      `[COGNITIVE] Execution: ${execution.strategy}`,
    );

    this.logger.log(
      `[COGNITIVE] Authority: ${execution.authority}`,
    );

    return output;
  }

  /*
   * =========================================================
   * DECISION
   * =========================================================
   */

  private buildDecision(
    detected: {
      intent: BrainIntent;
      confidence: number;
    },
    understanding: Understanding,
    context: ConversationContext | null,
  ): Decision {
    /*
     * ---------------------------------------------------------
     * QUESTION
     * ---------------------------------------------------------
     *
     * Une question explicitement détectée par le raisonnement
     * devient une décision cognitive directe.
     */

    if (
      understanding.intent ===
      BrainIntent.QUESTION
    ) {
      return {
        action: 'ANSWER',

        reason:
          'Le raisonnement a identifié une question explicite.',

        confidence:
          understanding.confidence,

        intent:
          BrainIntent.QUESTION,
      };
    }

    /*
     * ---------------------------------------------------------
     * CONTEXTE DISPONIBLE
     * ---------------------------------------------------------
     */

    if (context) {
      const brainDecision =
        this.decisionService.decide(
          detected.intent,
          detected.confidence,
          context,
        );

      return {
        action: brainDecision.action,

        reason:
          this.buildDecisionReason(
            brainDecision.action,
            understanding.intent,
          ),

        confidence:
          brainDecision.confidence,

        intent:
          understanding.intent,
      };
    }

    /*
     * ---------------------------------------------------------
     * AUCUN CONTEXTE
     * ---------------------------------------------------------
     */

    return {
      action: 'ASK_CLARIFICATION',

      reason:
        'Aucun contexte exploitable disponible.',

      confidence: 0,

      intent:
        understanding.intent,
    };
  }

  /*
   * =========================================================
   * EXECUTION PLAN
   * =========================================================
   */

  private buildExecutionPlan(
    decision: Decision,
    understanding: Understanding,
    reasoning: Reasoning,
  ): ExecutionPlan {
    const strategy =
      this.resolveExecutionStrategy(
        decision,
        understanding,
        reasoning,
      );

    return {
      action: decision.action,

      strategy,

      /*
       * Cognitive Authority :
       *
       * Le Cognitive Core est maintenant l'autorité
       * qui produit la décision et le plan d'exécution.
       *
       * Le BrainService reste temporairement responsable
       * de l'exécution physique des handlers.
       */
      authority: 'COGNITIVE_CORE',

      intent:
        understanding.intent,

      confidence:
        decision.confidence,

      reason:
        decision.reason,
    };
  }

  private resolveExecutionStrategy(
    decision: Decision,
    understanding: Understanding,
    reasoning: Reasoning,
  ): CognitiveExecutionStrategy {
    /*
     * QUESTION
     */

    if (
      understanding.intent ===
        BrainIntent.QUESTION &&
      reasoning.questions.length > 0
    ) {
      return 'ANSWER_QUESTION';
    }

    /*
     * CLARIFICATION
     */

    if (
      decision.action ===
      'ASK_CLARIFICATION'
    ) {
      return 'ASK_CLARIFICATION';
    }

    /*
     * CONTEXTE
     */

    if (
      decision.action ===
      'CONTINUE_CONTEXT'
    ) {
      return 'CONTINUE_CONTEXT';
    }

    /*
     * INTENTION RECONNUE
     */

    return 'ANSWER_INTENT';
  }

  /*
   * =========================================================
   * UNDERSTANDING ARBITRATION
   * =========================================================
   */

  private resolveUnderstanding(
    detected: {
      intent: BrainIntent;
      confidence: number;
    },

    reasoning: Reasoning,

    context: ConversationContext | null,
  ): Understanding {
    /*
     * ---------------------------------------------------------
     * QUESTION PRIORITAIRE
     * ---------------------------------------------------------
     */

    if (
      reasoning.questions.length > 0
    ) {
      this.logger.log(
        '[COGNITIVE] Reasoning overrides UNKNOWN → QUESTION',
      );

      return {
        intent:
          BrainIntent.QUESTION,

        confidence:
          Math.max(
            detected.confidence,
            0.95,
          ),

        subject:
          context?.activeTopic ??
          undefined,

        entities:
          context?.entities.map(
            (entity) => entity.value,
          ) ?? [],

        references:
          context?.references.map(
            (reference) =>
              reference.value,
          ) ?? [],

        source:
          'REASONING',
      };
    }

    /*
     * ---------------------------------------------------------
     * INTENTION CONNUE
     * ---------------------------------------------------------
     */

    if (
      detected.intent !==
      BrainIntent.UNKNOWN
    ) {
      return {
        intent:
          detected.intent,

        confidence:
          detected.confidence,

        subject:
          context?.activeTopic ??
          undefined,

        entities:
          context?.entities.map(
            (entity) => entity.value,
          ) ?? [],

        references:
          context?.references.map(
            (reference) =>
              reference.value,
          ) ?? [],

        source:
          'INTENT',
      };
    }

    /*
     * ---------------------------------------------------------
     * UNKNOWN
     * ---------------------------------------------------------
     */

    return {
      intent:
        BrainIntent.UNKNOWN,

      confidence:
        detected.confidence,

      subject:
        context?.activeTopic ??
        undefined,

      entities:
        context?.entities.map(
          (entity) => entity.value,
        ) ?? [],

      references:
        context?.references.map(
          (reference) =>
            reference.value,
        ) ?? [],

      source:
        'COGNITIVE',
    };
  }

  /*
   * =========================================================
   * SERIALIZATION
   * =========================================================
   */

  private serialize(
    item: unknown,
  ): string {
    if (
      typeof item === 'string'
    ) {
      return item;
    }

    if (
      item === null ||
      item === undefined
    ) {
      return '';
    }

    if (
      typeof item === 'object'
    ) {
      const record =
        item as Record<
          string,
          unknown
        >;

      if (
        typeof record.content ===
        'string'
      ) {
        return record.content;
      }

      if (
        typeof record.description ===
        'string'
      ) {
        return record.description;
      }

      if (
        typeof record.value ===
        'string'
      ) {
        return record.value;
      }
    }

    return JSON.stringify(item);
  }

  /*
   * =========================================================
   * DECISION REASON
   * =========================================================
   */

  private buildDecisionReason(
    action: string,
    intent: string,
  ): string {
    switch (action) {
      case 'ANSWER':
        return `Intent reconnu : ${intent}.`;

      case 'CONTINUE_CONTEXT':
        return 'Le contexte conversationnel permet de poursuivre.';

      case 'ASK_CLARIFICATION':
        return 'Les informations disponibles sont insuffisantes.';

      default:
        return `Décision produite pour l'intention : ${intent}.`;
    }
  }
}