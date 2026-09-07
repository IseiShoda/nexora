import { Injectable, Logger } from '@nestjs/common';

import {
  CognitiveInput,
  CognitiveOutput,
  Understanding,
  Reasoning,
  Decision,
} from './cognitive-core.types';

import {
  BrainIntent,
} from '../../brain/intents/intent.interface';

import { IntentService } from '../../brain/intents/intent.service';
import { BrainDecisionService } from '../../brain/decisions/brain-decision.service';
import { ContextService } from '../../context/services/context.service';
import { ReasoningService } from '../../reasoning/services/reasoning.service';

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
     *
     * Pour les intentions connues, on conserve
     * BrainDecisionService.
     *
     * Pour une question détectée par le raisonnement,
     * le Cognitive Core produit directement une décision
     * cohérente avec cette compréhension.
     */

    let decision: Decision;

    if (
      finalUnderstanding.intent ===
      BrainIntent.QUESTION
    ) {
      decision = {
        action: 'ANSWER',
        reason:
          'Le raisonnement a identifié une question explicite.',
        confidence:
          finalUnderstanding.confidence,
        intent: BrainIntent.QUESTION,
      };
    } else if (context) {
      const brainDecision =
        this.decisionService.decide(
          detected.intent,
          detected.confidence,
          context,
        );

      decision = {
        action: brainDecision.action,
        reason: this.buildDecisionReason(
          brainDecision.action,
          finalUnderstanding.intent,
        ),
        confidence: brainDecision.confidence,
        intent: finalUnderstanding.intent,
      };
    } else {
      decision = {
        action: 'ASK_CLARIFICATION',
        reason:
          'Aucun contexte exploitable disponible.',
        confidence: 0,
        intent: finalUnderstanding.intent,
      };
    }

    /*
     * =========================================================
     * 6. FINAL OUTPUT
     * =========================================================
     */

    const output: CognitiveOutput = {
      input,
      understanding: finalUnderstanding,
      reasoning,
      decision,
    };

    this.logger.log(
      `[COGNITIVE] Final intent: ${finalUnderstanding.intent}`,
    );

    this.logger.log(
      `[COGNITIVE] Decision: ${decision.action}`,
    );

    return output;
  }

  /*
   * ===========================================================
   * UNDERSTANDING ARBITRATION
   * ===========================================================
   */

  private resolveUnderstanding(
    detected: {
      intent: BrainIntent;
      confidence: number;
    },
    reasoning: Reasoning,
    context: any,
  ): Understanding {
    /*
     * Le raisonnement a explicitement identifié
     * une ou plusieurs questions.
     *
     * Il est donc prioritaire sur UNKNOWN.
     */

    if (
      reasoning.questions.length > 0
    ) {
      this.logger.log(
        '[COGNITIVE] Reasoning overrides UNKNOWN → QUESTION',
      );

      return {
        intent: BrainIntent.QUESTION,
        confidence: Math.max(
          detected.confidence,
          0.95,
        ),
        subject:
          context?.activeTopic ??
          undefined,
        entities:
          context?.entities?.map(
            (entity: any) => entity.value,
          ) ?? [],
        references:
          context?.references?.map(
            (reference: any) =>
              typeof reference === 'string'
                ? reference
                : reference.value ??
                  JSON.stringify(reference),
          ) ?? [],
        source: 'REASONING',
      };
    }

    /*
     * Si IntentService a identifié une intention
     * connue, nous la conservons.
     */

    if (
      detected.intent !== BrainIntent.UNKNOWN
    ) {
      return {
        intent: detected.intent,
        confidence: detected.confidence,
        subject:
          context?.activeTopic ??
          undefined,
        entities:
          context?.entities?.map(
            (entity: any) => entity.value,
          ) ?? [],
        references:
          context?.references?.map(
            (reference: any) =>
              typeof reference === 'string'
                ? reference
                : reference.value ??
                  JSON.stringify(reference),
          ) ?? [],
        source: 'INTENT',
      };
    }

    /*
     * Aucun signal suffisamment fort.
     */

    return {
      intent: BrainIntent.UNKNOWN,
      confidence: detected.confidence,
      subject:
        context?.activeTopic ??
        undefined,
      entities:
        context?.entities?.map(
          (entity: any) => entity.value,
        ) ?? [],
      references:
        context?.references?.map(
          (reference: any) =>
            typeof reference === 'string'
              ? reference
              : reference.value ??
                JSON.stringify(reference),
        ) ?? [],
      source: 'COGNITIVE',
    };
  }

  private serialize(
    item: unknown,
  ): string {
    if (typeof item === 'string') {
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
        item as Record<string, unknown>;

      if (
        typeof record.content === 'string'
      ) {
        return record.content;
      }

      if (
        typeof record.description === 'string'
      ) {
        return record.description;
      }

      if (
        typeof record.value === 'string'
      ) {
        return record.value;
      }
    }

    return JSON.stringify(item);
  }

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