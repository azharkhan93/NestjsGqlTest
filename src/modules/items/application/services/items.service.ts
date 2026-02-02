import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from '../dtos/create-item.dto';
import { UpdateItemInput } from '../dtos/update-item.dto';
import { ItemEntity } from '../../domain/entities/item.entity';

@Injectable()
export class ItemsService {
  private items: ItemEntity[] = [];
  private idCounter = 1;

  create(createItemInput: CreateItemInput): ItemEntity {
    const newItem: ItemEntity = {
      id: this.idCounter++,
      ...createItemInput,
    };
    this.items.push(newItem);
    return newItem;
  }

  findAll(): ItemEntity[] {
    return this.items;
  }

  findOne(id: number): ItemEntity {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  update(id: number, updateItemInput: UpdateItemInput): ItemEntity {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    const updatedItem = {
      ...this.items[itemIndex],
      ...updateItemInput,
    };
    this.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  remove(id: number): ItemEntity {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    const removedItem = this.items[itemIndex];
    this.items.splice(itemIndex, 1);
    return removedItem;
  }
}
