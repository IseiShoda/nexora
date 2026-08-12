import { Injectable } from '@nestjs/common';

import {
  ReasoningDependency,
  ReasoningFact,
  ReasoningImplication,
  ReasoningInference,
  ReasoningResult,
  ReasoningType,
  ReasoningUnknown,
} from '../interfaces/reasoning.interface';

import { ConversationContext } from '../../context/interfaces/context.interface';

@Injectable()
export class ReasoningService {
  analyze(
    message: string,
    subject: string | null,
    context?: ConversationContext,
  ): ReasoningResult {
    const normalized = this.normalize(message);

    console.log(
      '[REASONING] Message:',
      message,
    );

    console.log(
      '[REASONING] Subject:',
      subject,
    );

    if (context) {
      console.log(
        '[REASONING] Context topic:',
        context.activeTopic,
      );

      console.log(
        '[REASONING] Context entities:',
        context.entities,
      );

      console.log(
        '[REASONING] Context references:',
        context.references,
      );

      console.log(
        '[REASONING] Context messages:',
        context.messages,
      );
    }

    /*
     * =========================================================
     * QUESTION PROTECTION
     *
     * Une question ne doit jamais être analysée comme une
     * nouvelle exigence.
     *
     * Exemple :
     *
     * "Pourquoi Chrono Solar doit-il supporter
     * 100 000 utilisateurs tout en restant rapide ?"
     *
     * Cette phrase contient "doit", "supporter" et
     * "utilisateurs", mais elle reste une question.
     * =========================================================
     */
    if (
      normalized.endsWith('?') ||
      /^(pourquoi|comment|quand|ou|quel|quelle|quels|quelles|est-ce que|dois-je|doit-il|doit-elle)/i.test(
        normalized,
      )
    ) {
      return {
        subject,
        type: ReasoningType.UNKNOWN,
        facts: [],
        inferences: [],
        unknowns: [],
        implications: [],
        dependencies: [],
        questions: [message.trim()],
      };
    }

    const facts: ReasoningFact[] = [];
    const inferences: ReasoningInference[] = [];
    const unknowns: ReasoningUnknown[] = [];
    const implications: ReasoningImplication[] = [];
    const dependencies: ReasoningDependency[] = [];
    const questions: string[] = [];

    /*
     * =========================================================
     * CONTEXTUAL INFORMATION
     * =========================================================
     */

    const previousContext =
      context?.messages ?? [];

    const previousText = previousContext
      .map((item) =>
        this.normalize(item.content),
      )
      .join(' ');

    const previousAskedForLoadTarget =
      previousText.includes(
        'quelle charge cible',
      ) ||
      previousText.includes(
        'charge cible',
      ) ||
      previousText.includes(
        'niveau de scalabilite attendu',
      );

    /*
     * =========================================================
     * LOAD TARGET DETECTION
     * =========================================================
     */

    const loadTargetMatch =
      normalized.match(
        /(\d[\d\s.,]*)\s*(utilisateurs?|users?)/i,
      );

    /*
     * =========================================================
     * REQUIREMENT DETECTION
     * =========================================================
     */

    if (
      normalized.includes('doit') ||
      normalized.includes('il faut') ||
      normalized.includes('necessite') ||
      normalized.includes('besoin de') ||
      normalized.includes('exigence') ||
      normalized.includes('devra') ||
      normalized.includes('devront') ||
      normalized.includes('doivent') ||
      normalized.includes('devrait') ||
      normalized.includes('devra pouvoir') ||
      normalized.includes('doit pouvoir')
    ) {
      /*
       * =======================================================
       * FACT
       * =======================================================
       */

      facts.push({
        content: message.trim(),
        source: 'USER',
      });

      /*
       * =======================================================
       * CONTEXT FACT
       * =======================================================
       */

      if (context?.activeTopic) {
        facts.push({
          content:
            `Le projet concerné est ${context.activeTopic}.`,
          source: 'CONTEXT',
        });
      }

      /*
       * =======================================================
       * SCALABILITY
       * =======================================================
       */

      const isScalabilityRequirement =
        normalized.includes('scalable') ||
        normalized.includes('scalabilite') ||
        normalized.includes('montee en charge') ||
        normalized.includes('beaucoup d utilisateurs') ||
        normalized.includes('utilisateurs') ||
        normalized.includes('supporter') ||
        normalized.includes('supportera') ||
        normalized.includes('supporte');

      if (isScalabilityRequirement) {
        /*
         * -----------------------------------------------------
         * INFERENCE
         * -----------------------------------------------------
         */

        inferences.push({
          content:
            'Une architecture capable d absorber une augmentation de charge sera nécessaire.',
          basedOn: [message.trim()],
        });

        /*
         * -----------------------------------------------------
         * IMPLICATION
         * -----------------------------------------------------
         */

        implications.push({
          content:
            'L architecture devra pouvoir supporter une augmentation de charge.',
          basedOn: [message.trim()],
        });

        /*
         * -----------------------------------------------------
         * DEPENDENCIES
         * -----------------------------------------------------
         */

        this.addDependency(
          dependencies,
          'Architecture',
          'TECHNICAL',
        );

        this.addDependency(
          dependencies,
          'Infrastructure',
          'TECHNICAL',
        );

        this.addDependency(
          dependencies,
          'Base de données',
          'TECHNICAL',
        );

        /*
         * -----------------------------------------------------
         * LOAD TARGET
         * -----------------------------------------------------
         */

        if (loadTargetMatch) {
          const loadTarget =
            this.normalizeLoadTarget(
              loadTargetMatch[1],
            );

          /*
           * FACT
           */

          facts.push({
            content:
              `La charge cible est de ${loadTarget} utilisateurs.`,
            source: 'USER',
          });

          /*
           * INFERENCE
           */

          inferences.push({
            content:
              `Le système devra être dimensionné pour supporter jusqu à ${loadTarget} utilisateurs.`,
            basedOn: [
              message.trim(),
            ],
          });

          /*
           * IMPLICATION
           */

          implications.push({
            content:
              `L architecture devra être dimensionnée pour supporter une charge pouvant atteindre ${loadTarget} utilisateurs.`,
            basedOn: [
              message.trim(),
            ],
          });

          /*
           * DEPENDENCY
           */

          this.addDependency(
            dependencies,
            'Capacity Planning',
            'TECHNICAL',
          );
        } else if (
          !previousAskedForLoadTarget
        ) {
          /*
           * UNKNOWN
           */

          unknowns.push({
            content: 'Charge cible',
            reason:
              'Le niveau de scalabilité attendu n est pas encore défini.',
          });

          questions.push(
            'Quelle charge cible devons-nous prévoir ?',
          );
        }
      }

      /*
       * =======================================================
       * SECURITY
       * =======================================================
       */

      if (
        normalized.includes('securise') ||
        normalized.includes('securite')
      ) {
        inferences.push({
          content:
            'Le système devra intégrer des mécanismes permettant de protéger les données et les accès.',
          basedOn: [message.trim()],
        });

        implications.push({
          content:
            'L architecture devra intégrer des mécanismes de sécurité adaptés.',
          basedOn: [message.trim()],
        });

        this.addDependency(
          dependencies,
          'Security',
          'TECHNICAL',
        );
      }

      /*
       * =======================================================
       * PERFORMANCE
       * =======================================================
       */

      if (
        /\brapide\b/.test(normalized) ||
        /\brapides\b/.test(normalized) ||
        /\bperformance\b/.test(normalized) ||
        /\bperformant\b/.test(normalized) ||
        /\bperformante\b/.test(normalized) ||
        /\blatence\b/.test(normalized)
      ) {
        inferences.push({
          content:
            'Le système devra être conçu pour maintenir un temps de réponse faible.',
          basedOn: [message.trim()],
        });

        implications.push({
          content:
            'Les performances et la latence devront être prises en compte dans l architecture.',
          basedOn: [message.trim()],
        });

        this.addDependency(
          dependencies,
          'Performance',
          'TECHNICAL',
        );
      }

      /*
       * =======================================================
       * RESULT
       * =======================================================
       */

      return {
        subject,
        type: ReasoningType.REQUIREMENT,
        facts,
        inferences,
        unknowns,
        implications,
        dependencies,
        questions,
      };
    }

    /*
     * =========================================================
     * UNKNOWN
     * =========================================================
     */

    return {
      subject,
      type: ReasoningType.UNKNOWN,
      facts,
      inferences,
      unknowns,
      implications,
      dependencies,
      questions,
    };
  }

  /*
   * =========================================================
   * ADD DEPENDENCY
   * =========================================================
   */

  private addDependency(
    dependencies: ReasoningDependency[],
    content: string,
    type: string,
  ): void {
    const exists =
      dependencies.some(
        (dependency) =>
          dependency.content === content,
      );

    if (!exists) {
      dependencies.push({
        content,
        type,
      });
    }
  }

  /*
   * =========================================================
   * NORMALIZE LOAD TARGET
   * =========================================================
   */

  private normalizeLoadTarget(
    value: string,
  ): string {
    return value
      .replace(/\s+/g, ' ')
      .trim();
  }

  /*
   * =========================================================
   * NORMALIZATION
   * =========================================================
   */

  private normalize(
    text: string,
  ): string {
    return text
      .toLowerCase()
      .replace(/�/g, '')
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }
}