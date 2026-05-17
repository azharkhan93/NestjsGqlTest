import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { FileValidatorService } from '../security/file-validator';

@Injectable()
export class CloudinaryService {
  constructor(private readonly fileValidator: FileValidatorService) {}

  async uploadFile(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
    folder: string = 'nest_uploads',
  ): Promise<UploadApiResponse> {
    this.fileValidator.validate(fileBuffer, mimeType, fileBuffer.length);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(
              new InternalServerErrorException(
                `Cloudinary upload failed: ${error.message}`,
              ),
            );
          }
          resolve(result);
        },
      );

      upload.end(fileBuffer);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              `Cloudinary deletion failed: ${error.message}`,
            ),
          );
        }
        resolve(result);
      });
    });
  }
}
