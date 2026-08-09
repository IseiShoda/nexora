export interface ContextReference {
  value: string;
  resolvedTo: string | null;
  type: 'pronoun' | 'demonstrative' | 'implicit';
  confidence: number;
}