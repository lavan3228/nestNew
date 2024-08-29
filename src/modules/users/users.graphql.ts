import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  mail: string;
}

@ObjectType()
export class UpdateResponse {
  @Field(() => Int)
  statusCode: number;

  @Field()
  message: string;
}
