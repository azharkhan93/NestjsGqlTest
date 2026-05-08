import { NotFoundException } from '@nestjs/common';

/**
 * Guard that throws NotFoundException when entity is null.
 * Eliminates duplicated null-check boilerplate across all services.
 */
export function assertFound<T>(entity: T | null, label: string): T {
  if (!entity) throw new NotFoundException(`${label} not found`);
  return entity;
}
