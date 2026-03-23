import { BadRequestException } from '@nestjs/common';

export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = this.format(value);
    this.validate(this.value);
  }

  static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  get getValue(): string {
    return this.value;
  }

  private format(value: string): string {
    const cleaned = value.replace(/[^\d+]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }

  private validate(value: string): void {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(value)) {
      throw new BadRequestException(`Invalid phone number format: ${value}. Must be E.164.`);
    }
  }
}
