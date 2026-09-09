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

    const facts: ReasoningFact[] = [];
    const inferences: ReasoningInference[] = [];
    const unknowns: ReasoningUnknown[] = [];
    const implications: ReasoningImplication[] = [];
    const dependencies: ReasoningDependency[] = [];
    const questions: string[] = [];

    /*
     * =========================================================
     * QUESTION DETECTION
     * =========================================================
     */

    const isQuestion =
      normalized.endsWith('?') ||
      /^(pourquoi|comment|quand|ou|quel|quelle|quels|quelles|est-ce que|dois-je|doit-il|doit-elle)/i.test(
        normalized,
      );

    /*
     * =========================================================
     * QUESTION REASONING
     *
     * Une question explicite reste une QUESTION.
     *
     * Nous ne la transformons jamais directement en
     * REQUIREMENT même si elle contient des termes comme
     * "doit", "supporter", "utilisateurs", etc.
     * =========================================================
     */

    if (isQuestion) {
      questions.push(message.trim());

      /*
       * -------------------------------------------------------
       * CONTEXT FACT
       * -------------------------------------------------------
       */

      if (context?.activeTopic) {
        facts.push({
          content:
            `Le projet concerné est ${context.activeTopic}.`,
          source: 'CONTEXT',
        });
      }

      /*
       * -------------------------------------------------------
       * SUBJECT FACT
       * -------------------------------------------------------
       */

      if (
        subject &&
        context?.activeTopic !== subject
      ) {
        facts.push({
          content:
            `Le sujet concerné est ${subject}.`,
          source: 'CONTEXT',
        });
      }

      /*
       * -------------------------------------------------------
       * LOAD TARGET
       * -------------------------------------------------------
       */

      const loadTargetMatch =
        normalized.match(
          /(\d[\d\s.,]*)\s*(utilisateurs?|users?)/i,
        );

      if (loadTargetMatch) {
        const loadTarget =
          this.normalizeLoadTarget(
            loadTargetMatch[1],
          );

        facts.push({
          content:
            `La charge cible mentionnée est de ${loadTarget} utilisateurs.`,
          source: 'USER',
        });

        inferences.push({
          content:
            `Le système doit être capable de gérer une charge pouvant atteindre ${loadTarget} utilisateurs.`,
          basedOn: [
            message.trim(),
          ],
        });

        implications.push({
          content:
            'L architecture doit être conçue pour supporter une montée en charge importante.',
          basedOn: [
            message.trim(),
          ],
        });

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

        this.addDependency(
          dependencies,
          'Capacity Planning',
          'TECHNICAL',
        );

        /*
         * -----------------------------------------------------
         * UNKNOWN LOAD PROFILE
         * -----------------------------------------------------
         */

        unknowns.push({
          content:
            'Nombre d utilisateurs simultanés',
          reason:
            'Le nombre total d utilisateurs ne permet pas de déterminer combien d utilisateurs seront actifs simultanément.',
        });

        unknowns.push({
          content:
            'Profil de charge',
          reason:
            'La répartition et les variations de charge ne sont pas encore définies.',
        });
      }

      /*
       * -------------------------------------------------------
       * PERFORMANCE
       * -------------------------------------------------------
       */

      const mentionsPerformance =
        /\brapide\b/.test(normalized) ||
        /\brapides\b/.test(normalized) ||
        /\bperformance\b/.test(normalized) ||
        /\bperformant\b/.test(normalized) ||
        /\bperformante\b/.test(normalized) ||
        /\blatence\b/.test(normalized) ||
        /\btemps de reponse\b/.test(normalized);

      if (mentionsPerformance) {
        facts.push({
          content:
            'La performance et la rapidité du système sont des éléments importants de la question.',
          source: 'USER',
        });

        inferences.push({
          content:
            'Le système devra maintenir des performances acceptables même lorsque la charge augmente.',
          basedOn: [
            message.trim(),
          ],
        });

        implications.push({
          content:
            'La conception devra prendre en compte la performance, la latence et la montée en charge.',
          basedOn: [
            message.trim(),
          ],
        });

        this.addDependency(
          dependencies,
          'Performance',
          'TECHNICAL',
        );
      }

      /*
       * -------------------------------------------------------
       * PERFORMANCE UNKNOWN
       * -------------------------------------------------------
       */

      if (mentionsPerformance) {
        unknowns.push({
          content:
            'Temps de réponse cible',
          reason:
            'La notion de rapidité est mentionnée mais aucun objectif mesurable de temps de réponse n est défini.',
        });
      }

      /*
       * -------------------------------------------------------
       * QUESTION TYPE: WHY
       * -------------------------------------------------------
       */

      if (
        normalized.startsWith(
          'pourquoi',
        )
      ) {
        inferences.push({
          content:
            'La question cherche à comprendre la justification d une contrainte ou d un objectif du projet.',
          basedOn: [
            message.trim(),
          ],
        });

        implications.push({
          content:
            'Pour répondre correctement, Nexora doit relier la contrainte exprimée aux objectifs, besoins et conséquences techniques du projet.',
          basedOn: [
            message.trim(),
          ],
        });
      }

      /*
       * -------------------------------------------------------
       * QUESTION TYPE: HOW
       * -------------------------------------------------------
       */

      if (
        normalized.startsWith(
          'comment',
        )
      ) {
        inferences.push({
          content:
            'La question cherche à déterminer une méthode, une stratégie ou un mécanisme permettant d atteindre un objectif.',
          basedOn: [
            message.trim(),
          ],
        });
      }

      /*
       * -------------------------------------------------------
       * QUESTION TYPE: WHEN
       * -------------------------------------------------------
       */

      if (
        normalized.startsWith(
          'quand',
        )
      ) {
        inferences.push({
          content:
            'La question cherche à déterminer un moment, une échéance ou une condition temporelle.',
          basedOn: [
            message.trim(),
          ],
        });
      }

      /*
       * -------------------------------------------------------
       * QUESTION RESULT
       * -------------------------------------------------------
       */

      return {
        subject,
        type: ReasoningType.QUESTION,
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
     * CONTEXTUAL INFORMATION
     * =========================================================
     */

    const previousContext =
      context?.messages ?? [];

    const previousText =
      previousContext
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
          basedOn: [
            message.trim(),
          ],
        });

        /*
         * -----------------------------------------------------
         * IMPLICATION
         * -----------------------------------------------------
         */

        implications.push({
          content:
            'L architecture devra pouvoir supporter une augmentation de charge.',
          basedOn: [
            message.trim(),
          ],
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

          facts.push({
            content:
              `La charge cible est de ${loadTarget} utilisateurs.`,
            source: 'USER',
          });

          inferences.push({
            content:
              `Le système devra être dimensionné pour supporter jusqu à ${loadTarget} utilisateurs.`,
            basedOn: [
              message.trim(),
            ],
          });

          implications.push({
            content:
              `L architecture devra être dimensionnée pour supporter une charge pouvant atteindre ${loadTarget} utilisateurs.`,
            basedOn: [
              message.trim(),
            ],
          });

          this.addDependency(
            dependencies,
            'Capacity Planning',
            'TECHNICAL',
          );
        } else if (
          !previousAskedForLoadTarget
        ) {
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
          basedOn: [
            message.trim(),
          ],
        });

        implications.push({
          content:
            'L architecture devra intégrer des mécanismes de sécurité adaptés.',
          basedOn: [
            message.trim(),
          ],
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
          basedOn: [
            message.trim(),
          ],
        });

        implications.push({
          content:
            'Les performances et la latence devront être prises en compte dans l architecture.',
          basedOn: [
            message.trim(),
          ],
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
      .replace(/ï¿½/g, '')
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }
}