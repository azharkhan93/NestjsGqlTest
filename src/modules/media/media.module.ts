import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { MediaResolver } from './presentation/graphql/resolvers/media.resolver';

@Module({
  imports: [CommonModule],
  providers: [MediaResolver],
})
export class MediaModule {}
