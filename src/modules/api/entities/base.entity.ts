import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @Field(() => ID, {
    description: 'Identifies the unique uuid of the object',
  })
  id: string;

  @Field()
  active: boolean;

  @Field()
  deleted: boolean;

  @Field({
    description: 'Identifies the date and time when the object was created.',
  })
  createAt: Date;

  @Field({
    description:
      'Identifies the date and time when the object was last updated.',
  })
  updateAt: Date;
}
