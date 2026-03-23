import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SmsResponse')
export class SmsResponseType {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  sid?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  errorCode?: number;
}
