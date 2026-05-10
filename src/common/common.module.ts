import { Module } from '@nestjs/common';
import { PasetoService } from './application/security/paseto.service';
import { FileValidatorService } from './application/security/file-validator';
import { CloudinaryService } from './application/services/cloudinary.service';
import { CloudinaryProvider } from './infrastructure/cloudinary/cloudinary.provider';

@Module({
  providers: [
    PasetoService,
    FileValidatorService,
    CloudinaryService,
    CloudinaryProvider,
  ],
  exports: [
    PasetoService,
    FileValidatorService,
    CloudinaryService,
  ],
})
export class CommonModule {}
