import { NotFoundException } from '@nestjs/common';
import { DomainErrorMessages } from '@common/domain/exceptions/domain-error-messages.constants';

export function assertFound<T>(entity: T | null, label: string): T {
  if (!entity)
    throw new NotFoundException(DomainErrorMessages.RESOURCE_NOT_FOUND(label));
  return entity;
}
