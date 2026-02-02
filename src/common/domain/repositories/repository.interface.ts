export abstract class IRepository<T> {
  abstract create(item: T): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findOne(id: number): Promise<T | null>;
  abstract update(id: number, item: Partial<T>): Promise<T | null>;
  abstract remove(id: number): Promise<T | null>;
}
