import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidatorService {
  private readonly MAX_SIZE = 5 * 1024 * 1024; 
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  private readonly MAGIC_NUMBERS: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
  };

  validate(buffer: Buffer, mimeType: string, size: number): void {
    if (size > this.MAX_SIZE) {
      throw new BadRequestException('File size exceeds maximum allowed limit of 5MB.');
    }

    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(`Invalid file type: ${mimeType}. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`);
    }

    const magic = this.MAGIC_NUMBERS[mimeType];
    if (magic) {
      for (let i = 0; i < magic.length; i++) {
        if (buffer[i] !== magic[i]) {
          throw new BadRequestException('Malicious file detected: File signature does not match the mime type.');
        }
      }
    }
  }
}
