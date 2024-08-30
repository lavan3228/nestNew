import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './modules/users/users.graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
    }),
    FileUploadModule,
    // CacheModule.register({
    //   max: 100,
    //   ttl: 0,
    //   isGlobal: true,
    //   store: redisStore,
    //   host: '172.17.0.2',
    //   port: 6379,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
