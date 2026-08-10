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
    /*
     * =========================================================
     * INTENTIONS CONNUES
     * =========================================================
     *
     * Toutes les intentions reconnues par IntentService
     * sont traitées comme une demande à laquelle le cerveau
     * doit répondre.
     *
     * Cela inclut notamment :
     *
     * - GREETING
     * - NEXORA_IDENTITY
     * - USER_NAME
     * - USER_PROJECT
     * - PROJECT_REQUIREMENT
     * - PROJECT_REQUIREMENTS_QUERY
     */
    if (intent !== BrainIntent.UNKNOWN) {
      return {
        intent,
        action: BrainAction.ANSWER,
        confidence,
        topic: context.activeTopic,
      };
    }

    /*
     * =========================================================
     * INTENTION INCONNUE MAIS CONTEXTE DISPONIBLE
     * =========================================================
     *
     * Exemple :
     *
     * Contexte :
     * "Chrono Solar"
     *
     * Message :
     * "Et pour les coûts ?"
     *
     * L'intention n'est pas encore reconnue,
     * mais le contexte peut permettre de continuer.
     */
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

    /*
     * =========================================================
     * AUCUN CONTEXTE EXPLOITABLE
     * =========================================================
     */
    return {
      intent,
      action: BrainAction.ASK_CLARIFICATION,
      confidence: 0,
      topic: context.activeTopic,
    };
  }
}