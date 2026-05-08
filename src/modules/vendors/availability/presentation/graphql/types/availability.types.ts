import { Field, ID, Int, ObjectType, registerEnumType, InputType } from '@nestjs/graphql';
import { ExceptionType } from '@modules/vendors/availability/domain/entities';

registerEnumType(ExceptionType, { name: 'ExceptionType' });

@ObjectType('VendorSchedule')
export class VendorScheduleType {
  @Field(() => ID) id: string;
  @Field(() => Int) dayOfWeek: number;
  @Field() startTime: string;
  @Field() endTime: string;
  @Field() isActive: boolean;
}

@ObjectType('VendorBreak')
export class VendorBreakType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() startTime: string;
  @Field() endTime: string;
}

@ObjectType('VendorException')
export class VendorExceptionType {
  @Field(() => ID) id: string;
  @Field() date: Date;
  @Field({ nullable: true }) description?: string;
  @Field(() => ExceptionType) type: ExceptionType;
  @Field({ nullable: true }) startTime?: string;
  @Field({ nullable: true }) endTime?: string;
}

@ObjectType('VendorAvailabilityResponse')
export class VendorAvailabilityResponse {
  @Field(() => [VendorScheduleType]) schedule: VendorScheduleType[];
  @Field(() => [VendorBreakType]) breaks: VendorBreakType[];
  @Field(() => [VendorExceptionType]) exceptions: VendorExceptionType[];
}

@InputType()
export class UpdateScheduleInput {
  @Field(() => Int) dayOfWeek: number;
  @Field() startTime: string;
  @Field() endTime: string;
  @Field() isActive: boolean;
}

@InputType()
export class CreateBreakInput {
  @Field() name: string;
  @Field() startTime: string;
  @Field() endTime: string;
}

@InputType()
export class CreateExceptionInput {
  @Field() date: Date;
  @Field({ nullable: true }) description?: string;
  @Field(() => ExceptionType) type: ExceptionType;
  @Field({ nullable: true }) startTime?: string;
  @Field({ nullable: true }) endTime?: string;
}
