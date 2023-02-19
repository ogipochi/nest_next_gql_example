import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { JobsModule } from './jobs/jobs.module';
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
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
