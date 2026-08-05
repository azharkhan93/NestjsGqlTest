import DataLoader from 'dataloader';

export interface IBatchRepository<T> {
  findByIds(ids: string[]): Promise<T[]>;
}

export abstract class BaseDataLoader<T extends { id: string }> {
  protected readonly loader: DataLoader<string, T | null>;

  constructor(repository: IBatchRepository<T>) {
    this.loader = new DataLoader<string, T | null>(
      async (ids: readonly string[]) => {
        const items = await repository.findByIds([...ids]);
        const map = new Map<string, T>();
        items.forEach((item) => {
          if (item?.id) map.set(item.id, item);
        });
        return ids.map((id) => map.get(id) ?? null);
      },
    );
  }

  async load(id: string): Promise<T | null> {
    return this.loader.load(id);
  }

  async loadMany(ids: string[]): Promise<(T | null | Error)[]> {
    return this.loader.loadMany(ids);
  }
}
