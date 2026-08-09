import { MemoryData, MemoryRecord } from '../interfaces/memory.interface';

export const MEMORY_REPOSITORY = Symbol('MEMORY_REPOSITORY');

export interface MemoryRepository {
  create(data: MemoryData): Promise<MemoryRecord>;

  findAll(): Promise<MemoryRecord[]>;

  findByKey(key: string): Promise<MemoryRecord | null>;

  update(key: string, value: string): Promise<MemoryRecord>;

  delete(key: string): Promise<void>;
}