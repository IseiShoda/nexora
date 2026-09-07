export interface CognitiveInput {
  message: string;
  conversationId?: string;

  context: {
    activeTopic?: string;
    entities?: Record<string, unknown>;
    references?: Record<string, unknown>;
    recentMessages?: string[];
  };
}

export interface CognitiveUnderstanding {
  intent: string;
  confidence: number;
  subject?: string;
  entities: Record<string, unknown>;
  references: Record<string, unknown>;
}

export interface CognitiveReasoning {
  facts: string[];
  inferences: string[];
  unknowns: string[];
  implications: string[];
  dependencies: string[];
}

export interface CognitiveDecision {
  action: string;
  reason: string;
  confidence: number;
}

export interface CognitiveOutput {
  understanding: CognitiveUnderstanding;
  reasoning: CognitiveReasoning;
  decision: CognitiveDecision;
}