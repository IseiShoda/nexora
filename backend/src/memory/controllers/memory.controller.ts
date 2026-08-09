import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MemoryService } from '../services/memory.service';
import {
  CreateMemoryDto,
  UpdateMemoryDto,
} from '../dto/memory.dto';

@Controller('memory')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
  ) {}

  @Post()
  async create(@Body() body: CreateMemoryDto) {
    return this.memoryService.create({
      key: body.key,
      value: body.value,
    });
  }

  @Get()
  async getAll() {
    return this.memoryService.getAll();
  }

  @Get(':key')
  async get(@Param('key') key: string) {
    return this.memoryService.get(key);
  }

  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() body: UpdateMemoryDto,
  ) {
    return this.memoryService.update(
      key,
      body.value,
    );
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    await this.memoryService.delete(key);

    return {
      success: true,
      key,
    };
  }
}