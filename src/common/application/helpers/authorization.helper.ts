import { ForbiddenException } from '@nestjs/common';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { UserRole } from '@common/domain/enums';

export function assertOwnerOrAdmin(
  resourceUserId: string | null | undefined,
  currentUser: CurrentUserPayload,
  actionLabel = 'access this resource',
): void {
  if (
    !resourceUserId ||
    (currentUser.sub !== resourceUserId &&
      currentUser.role !== UserRole.SUPER_ADMIN)
  ) {
    throw new ForbiddenException(`You are not authorized to ${actionLabel}`);
  }
}
