import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CloudinaryService } from '@common/application/services/cloudinary.service';
import { UploadResponseType } from '../types/upload-response.type';
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts';

@Resolver()
export class MediaResolver {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Mutation(() => UploadResponseType)
  async uploadImage(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<UploadResponseType> {
    const { createReadStream, filename, mimetype } = file;
    
    
    const chunks: Buffer[] = [];
    for await (const chunk of createReadStream()) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    const result = await this.cloudinaryService.uploadFile(
      buffer,
      mimetype,
      filename,
      'media_uploads',
    );

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  }

  @Mutation(() => Boolean)
  async deleteImage(@Args('publicId') publicId: string): Promise<boolean> {
    const result = await this.cloudinaryService.deleteFile(publicId);
    return result.result === 'ok';
  }
}
