import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemsService } from '@modules/items/application/services';
import { Item } from '@modules/items/presentation/graphql/types';
import { CreateItemInput, UpdateItemInput } from '@modules/items/application/dtos';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => String }) id: string) {
    return this.itemsService.remove(id);
  }
}
