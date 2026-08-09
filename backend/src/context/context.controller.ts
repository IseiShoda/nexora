import { Controller, Get, Param } from '@nestjs/common';
import { ContextService } from './services/context.service';

@Controller('context')
export class ContextController {
  constructor(
    private readonly contextService: ContextService,
  ) {}

  @Get(':conversationId')
  async getContext(
    @Param('conversationId') conversationId: string,
  ) {
    return this.contextService.getContext(
      Number(conversationId),
    );
  }
}