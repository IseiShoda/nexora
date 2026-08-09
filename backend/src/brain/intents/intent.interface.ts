export enum BrainIntent {
  GREETING = 'GREETING',
  NEXORA_IDENTITY = 'NEXORA_IDENTITY',
  USER_NAME = 'USER_NAME',
  USER_PROJECT = 'USER_PROJECT',
  UNKNOWN = 'UNKNOWN',
}

export interface DetectedIntent {
  intent: BrainIntent;
  confidence: number;
}