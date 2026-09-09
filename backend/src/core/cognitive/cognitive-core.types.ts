export interface CognitiveInput {
  message: string;
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/*
 * =========================================================
 * UNDERSTANDING
 * =========================================================
 */

export interface Understanding {
  intent: string;
  confidence: number;
  subject?: string;
  entities: string[];
  references: string[];

  /**
   * Permet de savoir quelle capacité cognitive
   * a fourni le signal principal.
   */
  source?:
    | 'INTENT'
    | 'REASONING'
    | 'CONTEXT'
    | 'COGNITIVE';
}

/*
 * =========================================================
 * REASONING
 * =========================================================
 */

export interface Reasoning {
  type?: string;

  facts: string[];

  inferences: string[];

  unknowns: string[];

  implications: string[];

  dependencies: string[];

  questions: string[];
}

/*
 * =========================================================
 * DECISION
 * =========================================================
 */

export type CognitiveAction =
  | 'ANSWER'
  | 'CONTINUE_CONTEXT'
  | 'ASK_CLARIFICATION';

export interface Decision {
  action: CognitiveAction;

  reason: string;

  confidence: number;

  intent?: string;
}

/*
 * =========================================================
 * EXECUTION
 * =========================================================
 */

/**
 * Stratégie d'exécution actuellement disponible.
 *
 * Ces stratégies représentent les capacités d'exécution
 * déjà présentes dans Nexora.
 *
 * Elles ne créent pas encore de nouveau moteur de réponse.
 * Elles permettent simplement au Cognitive Core de décrire
 * précisément ce qui doit être exécuté.
 */
export type CognitiveExecutionStrategy =
  | 'ANSWER_INTENT'
  | 'CONTINUE_CONTEXT'
  | 'ASK_CLARIFICATION'
  | 'ANSWER_QUESTION';

/**
 * Autorité responsable de l'exécution.
 *
 * LEGACY_BRAIN :
 * le Cognitive Core a pris la décision mais le Brain
 * historique reste responsable de l'exécution.
 *
 * COGNITIVE_CORE :
 * le Cognitive Core devient responsable de l'exécution.
 *
 * Pour cette étape, nous restons volontairement en
 * LEGACY_BRAIN afin de conserver le mode Shadow.
 */
export type CognitiveExecutionAuthority =
  | 'LEGACY_BRAIN'
  | 'COGNITIVE_CORE';

export interface ExecutionPlan {
  action: CognitiveAction;

  strategy: CognitiveExecutionStrategy;

  authority: CognitiveExecutionAuthority;

  intent: string;

  confidence: number;

  reason: string;
}

/*
 * =========================================================
 * COGNITIVE OUTPUT
 * =========================================================
 */

export interface CognitiveOutput {
  input: CognitiveInput;

  understanding: Understanding;

  reasoning: Reasoning;

  decision: Decision;

  execution: ExecutionPlan;
}