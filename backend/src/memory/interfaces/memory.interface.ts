export interface MemoryData {
  key: string;
  value: string;
}

export interface MemoryRecord extends MemoryData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}