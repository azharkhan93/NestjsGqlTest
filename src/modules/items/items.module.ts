import { Module } from '@nestjs/common';
import { ItemsService } from '@modules/items/application/services';
import { ItemsResolver } from '@modules/items/presentation/graphql/resolvers/items.resolver';
import { IItemRepository } from '@modules/items/domain/repositories/item.repository.interface';
import { ItemRepository } from '@modules/items/infrastructure/persistence/repositories/item.repository';

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
