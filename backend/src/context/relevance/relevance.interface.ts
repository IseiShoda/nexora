export interface ContextRelevanceCandidate {
  entity: string;
  score: number;
  reason: string;
}

export interface ContextRelevanceResult {
  candidates: ContextRelevanceCandidate[];
  bestMatch: string | null;
}