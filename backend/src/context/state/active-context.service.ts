import { Injectable } from '@nestjs/common';
import { ContextEntity } from '../entities/entity.interface';

@Injectable()
export class ActiveContextService {
  private readonly activeContexts =
    new Map<number, ContextEntity>();

  setActiveContext(
    conversationId: number,
    entity: ContextEntity,
  ): void {
    this.activeContexts.set(
      conversationId,
      entity,
    );
  }

  getActiveContext(
    conversationId: number,
  ): ContextEntity | null {
    return (
      this.activeContexts.get(
        conversationId,
      ) ?? null
    );
  }

  clearContext(
    conversationId: number,
  ): void {
    this.activeContexts.delete(
      conversationId,
    );
  }
}