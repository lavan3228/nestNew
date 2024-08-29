import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { UpdateResponse, User } from '../users/users.graphql';
import { UsersService } from '../users/users.service';
import { Body } from '@nestjs/common';


@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UsersService) { }

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Query(() => User, { nullable: true })
    async singleUserGet(@Args('id') id: string): Promise<User | null> {
        return this.userService.findOne(id);
    }

    @Mutation(() => User, { nullable: true })
    async register(
        @Args('username') username: string,
        @Args('mail') mail: string,
        @Args('password') password: string,
    ): Promise<User | string> {
        try {
            const result = await this.userService.register({ username, mail, password });

            // If the result is a User object, return it
            if (result instanceof User) {
                return result;
            } else {
                // If the result is a string, return the error message
                return result;
            }
        } catch (error: any) {
            // Return error message if something goes wrong
            return `Error: ${error.message}`;
        }
    }

    @Mutation(() => String)
    async login(
        @Args('mail') mail: string,
        @Args('password') password: string,
    ): Promise<string> {
        try {
            const result = await this.userService.login({ mail, password });
            return result;
        } catch (error: any) {
            return `Error: ${error.message}`;
        }
    }

    @Mutation(() => UpdateResponse)
    async update(
        @Args('id') id: string,
        @Args('username') username: string,
        @Args('mail') mail: string,
    ): Promise<UpdateResponse> {
        return this.userService.update(id, { username, mail });
    }
}
