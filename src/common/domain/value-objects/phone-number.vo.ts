import { BadRequestException } from '@nestjs/common';
import { ValueObject } from '@common/domain/value-objects/value-object.base';

interface PhoneNumberProps {
  value: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  static create(value: string): PhoneNumber {
    const formatted = this.format(value);
    this.validate(formatted);
    return new PhoneNumber({ value: formatted });
  }

  get getValue(): string {
    return this.props.value;
  }

  private static format(value: string): string {
    const cleaned = value.replace(/[^\d+]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  private static validate(value: string): void {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(value)) {
      throw new BadRequestException(
        `Invalid phone number format: ${value}. Must be E.164.`,
      );
    }
  }
}
