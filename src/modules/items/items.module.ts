import { Module } from '@nestjs/common';
import { ItemsService } from './application/services/items.service';
import { ItemsResolver } from './presentation/graphql/items.resolver';

@Module({
  providers: [ItemsService, ItemsResolver],
})
export class ItemsModule {}
