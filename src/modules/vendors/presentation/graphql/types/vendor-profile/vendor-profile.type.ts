import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ServiceCategory } from '@modules/cms/service-category/presentation/graphql/types/service-category.type';

@ObjectType()
export class VendorProfileType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  businessName: string;

  @Field({ nullable: true })
  imageUri?: string;

  @Field({ nullable: true })
  gstNumber?: string;

  @Field({ nullable: true })
  contactNumber?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  serviceRadius?: string;

  @Field({ nullable: true })
  operatingHours?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  whyChooseMe?: string;

  @Field(() => [String], { defaultValue: [] })
  images: string[];

  @Field(() => [ServiceCategory], { defaultValue: [] })
  categories: ServiceCategory[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
