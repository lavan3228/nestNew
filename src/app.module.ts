import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './modules/users/users.graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

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
    // User, // Import UsersModule here
    UsersModule,
    GraphQLModule.forRoot({
      // driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
    FileUploadModule,
  ],
})
export class AppModule {}
