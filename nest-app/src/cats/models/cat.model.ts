import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Cat', { description: '猫' })
export class CatModel {
  @Field((type) => String, { description: '名前' })
  name: string;

  @Field((type) => Int, { description: '年齢' })
  age: number;

  @Field((type) => Int, { nullable: true, description: '飼い主の名前' })
  ownerName?: string;
}
