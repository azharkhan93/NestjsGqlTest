import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from '@modules/items/presentation/graphql/inputs';
import { ItemEntity } from '@modules/items/domain/entities';
import { IItemRepository } from '@modules/items/domain/repositories/item.repository.interface';
import { ItemName } from '@modules/items/domain/value-objects';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: IItemRepository) {}

  async create(createItemInput: CreateItemInput): Promise<ItemEntity> {
    const newItem = new ItemEntity();
    newItem.name = ItemName.create(createItemInput.name);
    newItem.description = createItemInput.description;
    
    return this.itemRepository.create(newItem);
  }

  async findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.findAll();
  }

  async findOne(id: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<ItemEntity> {
    const updateData: any = { ...updateItemInput };
    if (updateItemInput.name) {
      updateData.name = ItemName.create(updateItemInput.name);
    }
    
    const updatedItem = await this.itemRepository.update(id, updateData);
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<ItemEntity> {
    const deletedItem = await this.itemRepository.remove(id);
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return deletedItem;
  }
}
