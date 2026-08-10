export enum BrainIntent {
  GREETING = 'GREETING',
  NEXORA_IDENTITY = 'NEXORA_IDENTITY',
  USER_NAME = 'USER_NAME',
  USER_PROJECT = 'USER_PROJECT',
  PROJECT_REQUIREMENT = 'PROJECT_REQUIREMENT',
  UNKNOWN = 'UNKNOWN',
}

export interface DetectedIntent {
  intent: BrainIntent;
  confidence: number;
}