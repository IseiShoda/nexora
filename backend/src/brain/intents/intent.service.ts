import { Injectable } from '@nestjs/common';

import {
  BrainIntent,
  DetectedIntent,
} from './intent.interface';

@Injectable()
export class IntentService {
  detect(message: string): DetectedIntent {
    const normalized = this.normalize(message);

    console.log('[INTENT] Message:', message);
    console.log('[INTENT] Normalized:', normalized);

    /*
     * =========================================================
     * QUESTION
     *
     * Une question ne doit jamais être enregistrée comme
     * une nouvelle exigence.
     *
     * Exemple :
     * "Pourquoi Chrono Solar doit-il supporter 100 000 utilisateurs ?"
     *
     * Même si la phrase contient "doit", c'est une question.
     * =========================================================
     */
    if (
      normalized.endsWith('?') ||
      /^(pourquoi|comment|quand|ou|quel|quelle|quels|quelles|est-ce que|dois-je|doit-il|doit-elle)/i.test(
        normalized,
      )
    ) {
      return {
        intent: BrainIntent.UNKNOWN,
        confidence: 0.8,
      };
    }

    /*
     * =========================================================
     * GREETING
     * =========================================================
     */
    if (
      normalized.includes('bonjour') ||
      normalized.includes('salut') ||
      normalized.includes('hello') ||
      normalized.includes('bonsoir') ||
      normalized.includes('bonne journee')
    ) {
      return {
        intent: BrainIntent.GREETING,
        confidence: 1,
      };
    }

    /*
     * =========================================================
     * NEXORA IDENTITY
     * =========================================================
     */
    if (
      normalized.includes('qui es-tu') ||
      normalized.includes('qui es tu') ||
      normalized.includes('qui est nexora') ||
      normalized.includes('c est quoi nexora') ||
      normalized.includes('quest ce que nexora') ||
      normalized.includes('qu est ce que nexora')
    ) {
      return {
        intent: BrainIntent.NEXORA_IDENTITY,
        confidence: 1,
      };
    }

    /*
     * =========================================================
     * USER NAME
     * =========================================================
     */
    if (
      normalized.includes('quel est mon nom') ||
      normalized.includes('quel est mon prenom') ||
      normalized.includes('quel est mon pren') ||
      normalized.includes('comment je m appelle') ||
      normalized.includes('comment je mappelle') ||
      (
        normalized.includes('mon') &&
        (
          normalized.includes('prenom') ||
          normalized.includes('nom')
        )
      )
    ) {
      return {
        intent: BrainIntent.USER_NAME,
        confidence: 1,
      };
    }

    /*
     * =========================================================
     * USER PROJECT
     * =========================================================
     */
    if (
      normalized.includes('quel est mon projet') ||
      normalized.includes('sur quel projet') ||
      normalized.includes('quel projet') ||
      normalized.includes('mon projet')
    ) {
      return {
        intent: BrainIntent.USER_PROJECT,
        confidence: 1,
      };
    }

    /*
     * =========================================================
     * PROJECT REQUIREMENTS QUERY
     * =========================================================
     */
    if (
      normalized.includes('quelles sont les exigences') ||
      normalized.includes('quels sont les exigences') ||
      normalized.includes('quelles exigences') ||
      normalized.includes('quels exigences') ||
      normalized.includes('exigences du projet') ||
      normalized.includes('exigences de') ||
      normalized.includes('exigence du projet') ||
      normalized.includes('exigence de') ||
      normalized.includes('nos exigences') ||
      normalized.includes('les exigences') ||
      normalized.includes('quelles sont nos contraintes') ||
      normalized.includes('quelles contraintes') ||
      normalized.includes('nos contraintes') ||
      normalized.includes('contraintes du projet') ||
      normalized.includes('contrainte du projet') ||
      normalized.includes('qu est ce qui est requis') ||
      normalized.includes('ce qui est requis') ||
      normalized.includes('montre moi les exigences') ||
      normalized.includes('liste les exigences') ||
      normalized.includes('liste des exigences')
    ) {
      return {
        intent: BrainIntent.PROJECT_REQUIREMENTS_QUERY,
        confidence: 0.95,
      };
    }

    /*
     * =========================================================
     * PROJECT REQUIREMENT
     * =========================================================
     */
    if (
      normalized.includes('doit') ||
      normalized.includes('il faut') ||
      normalized.includes('il faudrait') ||
      normalized.includes('necessite') ||
      normalized.includes('necessaire') ||
      normalized.includes('besoin de') ||
      normalized.includes('a besoin de') ||
      normalized.includes('doit pouvoir') ||
      normalized.includes('doit permettre') ||
      normalized.includes('doit rester') ||
      normalized.includes('doit devenir') ||
      normalized.includes('doit garantir') ||
      normalized.includes('je veux que') ||
      normalized.includes('je souhaite que') ||
      normalized.includes('il est important que') ||
      normalized.includes('contrainte') ||
      normalized.includes('exigence') ||
      normalized.includes('devra') ||
      normalized.includes('devront') ||
      normalized.includes('doivent') ||
      normalized.includes('devrait')
    ) {
      return {
        intent: BrainIntent.PROJECT_REQUIREMENT,
        confidence: 0.9,
      };
    }

    /*
     * =========================================================
     * UNKNOWN
     * =========================================================
     */
    return {
      intent: BrainIntent.UNKNOWN,
      confidence: 0,
    };
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/�/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}