export interface ContextEntity {
  type: string;
  value: string;
  source: 'message' | 'memory';
  confidence: number;
}