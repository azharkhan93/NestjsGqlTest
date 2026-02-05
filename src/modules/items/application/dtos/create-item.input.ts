import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(10)
  description?: string;
}
