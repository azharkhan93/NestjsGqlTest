import { IRepository } from '@common/domain/repositories';
import { PrismaService } from './prisma.service';

import { BaseEntity } from '@common/domain/entities';

export abstract class PrismaRepository<T extends BaseEntity, PrismaModel> implements IRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    return this.prisma[this.modelName];
  }

  abstract toEntity(model: PrismaModel): T;
  abstract toPrisma(entity: T): any;

  async create(item: T): Promise<T> {
    const data = this.toPrisma(item);
    const result = await this.model.create({ data });
    return this.toEntity(result);
  }

  async findAll(): Promise<T[]> {
    const results = await this.model.findMany();
    return results.map((result) => this.toEntity(result));
  }

  async findOne(id: string): Promise<T | null> {
    const result = await this.model.findUnique({
      where: { id },
    });
    return result ? this.toEntity(result) : null;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const data = this.toPrisma(item as T);
    const result = await this.model.update({
      where: { id },
      data,
    });
    return result ? this.toEntity(result) : null;
  }

  async remove(id: string): Promise<T | null> {
    const result = await this.model.delete({
      where: { id },
    });
    return result ? this.toEntity(result) : null;
  }
}
