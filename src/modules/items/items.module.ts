import { Module } from '@nestjs/common';
import { ItemsService } from './application/services/items.service';
import { ItemsResolver } from './presentation/graphql/resolvers/items.resolver';
import { IItemRepository } from './domain/repositories/item.repository.interface';
import { ItemRepository } from './infrastructure/persistence/repositories/item.repository';

@Module({
  providers: [
    ItemsService,
    ItemsResolver,
    {
      provide: IItemRepository,
      useClass: ItemRepository,
    },
  ],
})
export class ItemsModule {}
