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

  // Permet de savoir comment l'interprétation a été obtenue
  source?: 'INTENT' | 'REASONING' | 'CONTEXT' | 'COGNITIVE';
}

export interface Reasoning {
  type?: string;

  facts: string[];
  inferences: string[];
  unknowns: string[];
  implications: string[];
  dependencies: string[];
  questions: string[];
}

export interface Decision {
  action: string;
  reason: string;
  confidence: number;
  intent?: string;
}

export interface CognitiveOutput {
  input: CognitiveInput;
  understanding: Understanding;
  reasoning: Reasoning;
  decision: Decision;
}