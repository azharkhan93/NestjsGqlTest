import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from '../dtos/create-item.dto';
import { UpdateItemInput } from '../dtos/update-item.dto';
import { ItemEntity } from '../../domain/entities/item.entity';
import { IItemRepository } from '../../domain/repositories/item.repository.interface';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: IItemRepository) {}

  async create(createItemInput: CreateItemInput): Promise<ItemEntity> {
    const newItem = new ItemEntity();
    Object.assign(newItem, createItemInput);
    // Repository handles ID generation and timestamps
    return this.itemRepository.create(newItem);
  }

  async findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.findAll();
  }

  async findOne(id: number): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateItemInput: UpdateItemInput): Promise<ItemEntity> {
    const updatedItem = await this.itemRepository.update(id, updateItemInput);
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async remove(id: number): Promise<ItemEntity> {
    const removedItem = await this.itemRepository.remove(id);
    if (!removedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return removedItem;
  }
}
