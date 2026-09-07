import { Injectable, Logger } from '@nestjs/common';

import {
  CognitiveInput,
  CognitiveOutput,
  Decision,
  Reasoning,
  Understanding,
} from './cognitive-core.types';

@Injectable()
export class CognitiveCoreService {
  private readonly logger = new Logger(CognitiveCoreService.name);

  process(input: CognitiveInput): CognitiveOutput {
    this.logger.log(
      `[COGNITIVE] Processing input: "${input.message}"`,
    );

    const understanding = this.buildUnderstanding(input);

    const reasoning = this.buildReasoning(
      input,
      understanding,
    );

    const decision = this.buildDecision(
      input,
      understanding,
      reasoning,
    );

    const output: CognitiveOutput = {
      input,
      understanding,
      reasoning,
      decision,
    };

    this.logger.log(
      `[COGNITIVE] Completed - intent=${understanding.intent}, confidence=${understanding.confidence}`,
    );

    return output;
  }

  private buildUnderstanding(
    input: CognitiveInput,
  ): Understanding {
    const message = input.message.trim();

    if (!message) {
      return {
        intent: 'UNKNOWN',
        confidence: 0,
        entities: [],
        references: [],
      };
    }

    const normalized = message.toLowerCase();

    if (
      normalized.includes('doit') ||
      normalized.includes('il faut') ||
      normalized.includes('devra') ||
      normalized.includes('nécessaire')
    ) {
      return {
        intent: 'REQUIREMENT',
        confidence: 0.8,
        entities: [],
        references: [],
      };
    }

    if (
      normalized.includes('objectif') ||
      normalized.includes('but') ||
      normalized.includes('je veux')
    ) {
      return {
        intent: 'GOAL',
        confidence: 0.8,
        entities: [],
        references: [],
      };
    }

    if (
      normalized.includes('?') ||
      normalized.startsWith('pourquoi') ||
      normalized.startsWith('comment') ||
      normalized.startsWith('quel') ||
      normalized.startsWith('quelle')
    ) {
      return {
        intent: 'QUESTION',
        confidence: 0.8,
        entities: [],
        references: [],
      };
    }

    return {
      intent: 'UNKNOWN',
      confidence: 0.2,
      entities: [],
      references: [],
    };
  }

  private buildReasoning(
    input: CognitiveInput,
    understanding: Understanding,
  ): Reasoning {
    const message = input.message.trim();

    const reasoning: Reasoning = {
      facts: [],
      inferences: [],
      unknowns: [],
      implications: [],
      dependencies: [],
    };

    if (!message) {
      reasoning.unknowns.push('Input message is empty.');
      return reasoning;
    }

    if (understanding.intent === 'REQUIREMENT') {
      reasoning.facts.push(
        'The user expressed a requirement or necessity.',
      );

      reasoning.implications.push(
        'The requirement may need to be analyzed before implementation.',
      );
    }

    if (understanding.intent === 'GOAL') {
      reasoning.facts.push(
        'The user expressed a goal or desired outcome.',
      );

      reasoning.implications.push(
        'The goal may need to be decomposed into actionable steps.',
      );
    }

    if (understanding.intent === 'QUESTION') {
      reasoning.facts.push(
        'The user is requesting information or explanation.',
      );
    }

    if (understanding.intent === 'UNKNOWN') {
      reasoning.unknowns.push(
        'The intended purpose of the user message is not yet understood.',
      );
    }

    return reasoning;
  }

  private buildDecision(
    input: CognitiveInput,
    understanding: Understanding,
    reasoning: Reasoning,
  ): Decision {
    if (understanding.intent === 'UNKNOWN') {
      return {
        action: 'ASK_CLARIFICATION',
        reason:
          'The cognitive core does not have enough information to determine the user intent.',
        confidence: 0.8,
      };
    }

    if (understanding.intent === 'GOAL') {
      return {
        action: 'PROCESS_GOAL',
        reason:
          'The user expressed a goal that may require goal analysis and decomposition.',
        confidence: 0.8,
      };
    }

    if (understanding.intent === 'REQUIREMENT') {
      return {
        action: 'PROCESS_REQUIREMENT',
        reason:
          'The user expressed a requirement that should be analyzed and structured.',
        confidence: 0.8,
      };
    }

    if (understanding.intent === 'QUESTION') {
      return {
        action: 'ANSWER',
        reason:
          'The user is asking a question that can be handled as an information request.',
        confidence: 0.8,
      };
    }

    return {
      action: 'CONTINUE',
      reason:
        'The cognitive core identified an actionable input.',
      confidence: 0.5,
    };
  }
}