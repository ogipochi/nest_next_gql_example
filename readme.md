Nest.js の設定をいじって、Next.js の`nest-generated`というディレクトリに型定義を生成してみましょう。
実はこの機能はすでに用意されていて、[公式のドキュメント](https://docs.nestjs.com/graphql/quick-start#schema-first)にあるように`ApolloDriverConfig`の引数の`definitions`に生成先などの情報を渡すことができます。

```ts: nest-app/src/app.module.ts
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

// 型定義を作成する先を定義
const GQL_TS_TYPE_DIR = '../next-app/nest-generated';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      definitions: {
        path: join(process.cwd(), GQL_TS_TYPE_DIR, 'graphql.ts'), // TypeScriptの型定義ファイルを作成,
      },
    }),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


```

これで開発用サーバーの起動コマンドなどを実行すると、そのときの GraphQL スキーマに対応する型定義を生成することができます。

```sh: ターミナル
$ npm run start:dev
```

生成される型定義は以下のようなものです。

```ts: gql/src/graphql.ts

/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Cat {
    age: number;
    name: string;
    ownerName?: Nullable<number>;
}

export interface IQuery {
    cat(): Cat | Promise<Cat>;
}

type Nullable<T> = T | null;

```

# 補足

実際には Dev 環境のみなどで利用することになると思うので、useFactory()と ConfigService を使用して以下のような使い分けをすると良いかもしれませんね。

```ts: nest-app/src/app.module.ts

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // 環境情報を取得
        const nodeEnv = configService.get('NODE_ENV', 'development');
        if (nodeEnv === 'development') {
          // 出力先を取得
          const gqlTsTypeDir = configService.getOrThrow('GQL_TS_TYPE_DIR');
          return {
            driver: ApolloDriver,
            debug: true,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            definitions: {
              path: join(process.cwd(), gqlTsTypeDir, 'graphql.ts'), // TypeScriptの型定義ファイルを作成,
            },
          };
        } else {
          return {
            driver: ApolloDriver,
            debug: false,
            playground: false,
            autoSchemaFile: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
