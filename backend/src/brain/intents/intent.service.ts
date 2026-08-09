import { Injectable } from '@nestjs/common';
import {
  BrainIntent,
  DetectedIntent,
} from './intent.interface';

@Injectable()
export class IntentService {
  detect(message: string): DetectedIntent {
    const normalized = this.normalize(message);

    if (
      normalized.includes('bonjour') ||
      normalized.includes('salut') ||
      normalized.includes('hello') ||
      normalized.includes('bonsoir')
    ) {
      return {
        intent: BrainIntent.GREETING,
        confidence: 1,
      };
    }

    if (
      normalized.includes('qui es-tu') ||
      normalized.includes('qui es tu') ||
      normalized.includes('qui est nexora')
    ) {
      return {
        intent: BrainIntent.NEXORA_IDENTITY,
        confidence: 1,
      };
    }

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

    if (
      normalized.includes('quel est mon projet') ||
      normalized.includes('sur quel projet') ||
      normalized.includes('quel projet')
    ) {
      return {
        intent: BrainIntent.USER_PROJECT,
        confidence: 1,
      };
    }

    return {
      intent: BrainIntent.UNKNOWN,
      confidence: 0,
    };
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}