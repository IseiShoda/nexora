import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type {
  MemoryData,
  MemoryRecord,
} from '../interfaces/memory.interface';

import {
  MEMORY_REPOSITORY,
} from '../repositories/memory.repository';

import type {
  MemoryRepository,
} from '../repositories/memory.repository';

@Injectable()
export class MemoryService {
  constructor(
    @Inject(MEMORY_REPOSITORY)
    private readonly repository: MemoryRepository,
  ) {}

  async create(data: MemoryData): Promise<MemoryRecord> {
    const existing =
      await this.repository.findByKey(data.key);

    if (existing) {
      return this.repository.update(
        data.key,
        data.value,
      );
    }

    return this.repository.create(data);
  }

  async getAll(): Promise<MemoryRecord[]> {
    return this.repository.findAll();
  }

  async get(
    key: string,
  ): Promise<MemoryRecord | null> {
    return this.repository.findByKey(key);
  }

  async update(
    key: string,
    value: string,
  ): Promise<MemoryRecord> {
    const existing =
      await this.repository.findByKey(key);

    if (!existing) {
      throw new NotFoundException(
        `La mémoire "${key}" n'existe pas.`,
      );
    }

    return this.repository.update(
      key,
      value,
    );
  }

  async delete(key: string): Promise<void> {
    const existing =
      await this.repository.findByKey(key);

    if (!existing) {
      throw new NotFoundException(
        `La mémoire "${key}" n'existe pas.`,
      );
    }

    await this.repository.delete(key);
  }

  async remember(
    key: string,
    value: string,
  ): Promise<MemoryRecord> {
    return this.create({
      key,
      value,
    });
  }

  async forget(key: string): Promise<void> {
    await this.delete(key);
  }

  async processMessage(
    message: string,
  ): Promise<void> {
    const normalized =
      this.normalize(message);

    let match: RegExpMatchArray | null = null;

    match = normalized.match(
      /je\s+m\s*['’]?\s*appelle\s+([a-zà-ÿ-]+)/i,
    );

    if (!match) {
      match = normalized.match(
        /mon\s+pren[o�]m\s+est\s+([a-zà-ÿ-]+)/i,
      );
    }

    if (!match) {
      match = normalized.match(
        /je\s+suis\s+([a-zà-ÿ-]+)/i,
      );
    }

    if (!match) {
      return;
    }

    const name =
      this.capitalizeName(match[1]);

    await this.remember(
      'name',
      name,
    );
  }

  async getUserName(): Promise<string | null> {
    const memory =
      await this.get('name');

    return memory?.value ?? null;
  }

  private normalize(
    text: string,
  ): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(/\s+/g, ' ')
      .trim();
  }

  private capitalizeName(
    name: string,
  ): string {
    if (!name) {
      return name;
    }

    return (
      name.charAt(0).toUpperCase() +
      name.slice(1).toLowerCase()
    );
  }
}