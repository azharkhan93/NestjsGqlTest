
import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/common/domain/value-objects/value-object.base';

interface ItemNameProps {
  value: string;
}

export class ItemName extends ValueObject<ItemNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: ItemNameProps) {
    super(props);
  }

  public static create(name: string): ItemName {
    if (name === undefined || name === null || name.length < 3) {
      throw new BadRequestException('Item name must be at least 3 characters long');
    }
    return new ItemName({ value: name });
  }
}
