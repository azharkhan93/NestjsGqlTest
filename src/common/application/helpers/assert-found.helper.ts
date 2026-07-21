import { NotFoundException } from '@nestjs/common';

export function assertFound<T>(entity: T | null, label: string): T {
  if (!entity) throw new NotFoundException(`${label} not found`);
  return entity;
}
