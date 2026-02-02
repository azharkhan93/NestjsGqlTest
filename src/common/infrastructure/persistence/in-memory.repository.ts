import { BaseEntity } from '../../domain/entities/base.entity';
import { IRepository } from '../../domain/repositories/repository.interface';

export class InMemoryRepository<T extends BaseEntity> extends IRepository<T> {
  protected items: T[] = [];
  protected idCounter = 1;

  async create(item: T): Promise<T> {
    item.id = this.idCounter++;
    item.createdAt = new Date();
    item.updatedAt = new Date();
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async findOne(id: number): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async update(id: number, item: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      return null;
    }
    this.items[index] = {
      ...this.items[index],
      ...item,
      updatedAt: new Date(),
    };
    return this.items[index];
  }

  async remove(id: number): Promise<T | null> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      return null;
    }
    const removed = this.items[index];
    this.items.splice(index, 1);
    return removed;
  }
}
