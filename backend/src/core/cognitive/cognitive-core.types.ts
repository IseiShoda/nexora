export interface CognitiveInput {
  message: string;
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface Understanding {
  intent: string;
  confidence: number;
  subject?: string;
  entities: string[];
  references: string[];
}

export interface Reasoning {
  facts: string[];
  inferences: string[];
  unknowns: string[];
  implications: string[];
  dependencies: string[];
}

export interface Decision {
  action: string;
  reason: string;
  confidence: number;
}

export interface CognitiveOutput {
  input: CognitiveInput;
  understanding: Understanding;
  reasoning: Reasoning;
  decision: Decision;
}