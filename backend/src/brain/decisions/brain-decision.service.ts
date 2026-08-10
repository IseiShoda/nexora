import { Injectable } from '@nestjs/common';

import {
  BrainIntent,
} from '../intents/intent.interface';

import {
  BrainAction,
  BrainDecision,
} from './brain-decision.interface';

import { ConversationContext } from '../../context/interfaces/context.interface';

@Injectable()
export class BrainDecisionService {
  decide(
    intent: BrainIntent,
    confidence: number,
    context: ConversationContext,
  ): BrainDecision {
    if (
      intent !== BrainIntent.UNKNOWN
    ) {
      return {
        intent,
        action: BrainAction.ANSWER,
        confidence,
        topic: context.activeTopic,
      };
    }

    if (
      context.relevance.bestMatch &&
      context.activeTopic
    ) {
      return {
        intent,
        action: BrainAction.CONTINUE_CONTEXT,
        confidence: 1,
        topic: context.activeTopic,
      };
    }

    return {
      intent,
      action: BrainAction.ASK_CLARIFICATION,
      confidence: 0,
      topic: context.activeTopic,
    };
  }
}