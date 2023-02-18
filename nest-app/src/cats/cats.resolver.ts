import { Query, Resolver } from '@nestjs/graphql';
import { CatModel } from './models/cat.model';

@Resolver((of) => CatModel)
export class CatsResolver {
  @Query((returns) => CatModel, { description: '飼い猫情報を取得' })
  async cat() {
    return await {
      name: 'ハン・ゾロ',
      age: 10,
      owner: 'ルーズ・スパイウォーカー',
    };
  }
}
