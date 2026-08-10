export enum ReasoningType {
  FACT = 'FACT',
  REQUIREMENT = 'REQUIREMENT',
  GOAL = 'GOAL',
  CONSTRAINT = 'CONSTRAINT',
  DECISION = 'DECISION',
  QUESTION = 'QUESTION',
  UNKNOWN = 'UNKNOWN',
}

export interface ReasoningFact {
  content: string;
  source: 'USER' | 'CONTEXT' | 'MEMORY' | 'SYSTEM';
}

export interface ReasoningInference {
  content: string;
  basedOn: string[];
}

export interface ReasoningUnknown {
  content: string;
  reason: string;
}

export interface ReasoningImplication {
  content: string;
  basedOn: string[];
}

export interface ReasoningDependency {
  content: string;
  type?: string;
}

export interface ReasoningResult {
  subject: string | null;

  type: ReasoningType;

  facts: ReasoningFact[];

  inferences: ReasoningInference[];

  unknowns: ReasoningUnknown[];

  implications: ReasoningImplication[];

  dependencies: ReasoningDependency[];

  questions: string[];
}