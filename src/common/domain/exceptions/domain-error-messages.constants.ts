export const DomainErrorMessages = {
  UNAUTHORIZED_ACTION: (action: string): string =>
    `You are not authorized to ${action}.`,
  RESOURCE_NOT_FOUND: (resource: string): string => `${resource} not found.`,
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
  MISSING_TOKEN: 'Missing or invalid token',
  INVALID_OR_EXPIRED_OTP: 'Invalid or expired OTP',
  SUPER_ADMIN_PHONE_AUTH_DISABLED:
    'Super admin accounts cannot be registered or authenticated via phone OTP',
  FILE_SIZE_EXCEEDED: (maxMb: number): string =>
    `File size exceeds maximum allowed limit of ${maxMb}MB.`,
  INVALID_FILE_TYPE: (type: string, allowed: string[]): string =>
    `Invalid file type: ${type}. Allowed types: ${allowed.join(', ')}`,
  MALICIOUS_FILE_DETECTED:
    'Malicious file detected: File signature does not match the mime type.',
  CORS_BLOCKED: (origin: string): string =>
    `CORS Policy: Origin ${origin} not allowed`,
} as const;
