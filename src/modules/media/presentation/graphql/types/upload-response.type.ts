import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResponseType {
  @Field()
  url: string;

  @Field()
  public_id: string;

  @Field()
  format: string;

  @Field()
  bytes: number;
}
