export enum BrainIntent {
  GREETING = 'GREETING',
  NEXORA_IDENTITY = 'NEXORA_IDENTITY',
  USER_NAME = 'USER_NAME',
  USER_PROJECT = 'USER_PROJECT',
  PROJECT_REQUIREMENT = 'PROJECT_REQUIREMENT',
  PROJECT_REQUIREMENTS_QUERY = 'PROJECT_REQUIREMENTS_QUERY',

  // Intentions enrichies par le Cognitive Core
  QUESTION = 'QUESTION',

  UNKNOWN = 'UNKNOWN',
}

export interface DetectedIntent {
  intent: BrainIntent;
  confidence: number;
}