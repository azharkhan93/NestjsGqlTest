export abstract class IRepository<T> {
  abstract create(item: T): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findOne(id: string): Promise<T | null>;
  abstract update(id: string, item: Partial<T>): Promise<T | null>;
  abstract remove(id: string): Promise<T | null>;
}
