import { BrainIntent } from '../intents/intent.interface';

export enum BrainAction {
  ANSWER = 'ANSWER',

  CONTINUE_CONTEXT = 'CONTINUE_CONTEXT',

  ASK_CLARIFICATION = 'ASK_CLARIFICATION',
}

export interface BrainDecision {
  intent: BrainIntent;

  action: BrainAction;

  confidence: number;

  topic: string | null;
}