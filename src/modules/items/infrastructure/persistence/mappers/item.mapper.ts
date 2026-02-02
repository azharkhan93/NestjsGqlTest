import { ItemEntity } from '../../../domain/entities/item.entity';
import { ItemSchema } from '../entities/item.schema';

export class ItemMapper {
  static toDomain(schema: ItemSchema): ItemEntity {
    const entity = new ItemEntity();
    entity.id = schema.id;
    entity.name = schema.name;
    entity.description = schema.description;
    entity.createdAt = schema.createdAt;
    entity.updatedAt = schema.updatedAt;
    return entity;
  }

  static toPersistence(entity: ItemEntity): ItemSchema {
    const schema = new ItemSchema();
    schema.id = entity.id;
    schema.name = entity.name;
    schema.description = entity.description;
    schema.createdAt = entity.createdAt;
    schema.updatedAt = entity.updatedAt;
    return schema;
  }
}
