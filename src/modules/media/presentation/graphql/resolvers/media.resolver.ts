import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from '@common/presentation/guards';
import { CurrentUser } from '@common/presentation/decorators';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { UserRole } from '@common/domain/enums';
import { CloudinaryService } from '@common/application/services/cloudinary.service';
import { UploadResponseType } from '../types/upload-response.type';
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts';

@Resolver()
@UseGuards(GqlAuthGuard)
export class MediaResolver {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Mutation(() => UploadResponseType)
  async uploadImage(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @CurrentUser() user: CurrentUserPayload,
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
      `media_uploads/${user.sub}`,
    );

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  }

  @Mutation(() => Boolean)
  async deleteImage(
    @Args('publicId') publicId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<boolean> {
    const isOwner =
      publicId.startsWith(`media_uploads/${user.sub}/`) ||
      publicId.includes(user.sub);
    const isAdmin = user.role === UserRole.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete this media asset',
      );
    }

    const result = await this.cloudinaryService.deleteFile(publicId);
    return result.result === 'ok';
  }
}
