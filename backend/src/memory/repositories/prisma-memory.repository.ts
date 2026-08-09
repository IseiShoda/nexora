import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Prisma/prisma.service';
import {
  MemoryData,
  MemoryRecord,
} from '../interfaces/memory.interface';
import { MemoryRepository } from './memory.repository';

@Injectable()
export class PrismaMemoryRepository implements MemoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: MemoryData): Promise<MemoryRecord> {
    return this.prisma.userMemory.create({
      data: {
        key: data.key,
        value: data.value,
      },
    });
  }

  async findAll(): Promise<MemoryRecord[]> {
    return this.prisma.userMemory.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findByKey(key: string): Promise<MemoryRecord | null> {
    return this.prisma.userMemory.findUnique({
      where: {
        key,
      },
    });
  }

  async update(
    key: string,
    value: string,
  ): Promise<MemoryRecord> {
    return this.prisma.userMemory.update({
      where: {
        key,
      },
      data: {
        value,
      },
    });
  }

  async delete(key: string): Promise<void> {
    await this.prisma.userMemory.delete({
      where: {
        key,
      },
    });
  }
}