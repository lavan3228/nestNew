import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('users')
// @UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.usersService.register(body);
  }

  @Get('allUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return await this.usersService.login(body);
  }

  @Get('singleUser/:id')
  async findOne(@Param('id') id: string) {
    console.log("single User", id)
    return await this.usersService.findOne(id);
  }

  @Put('update/:id')
  Update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('deleteUser/:id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Get('/all')
  // @CacheKey('users')
  async getAllUsers() {
    console.log('get jsonPlaceholder data');
    
    const data = await this.usersService.getUsers();
    return {
      success: true,
      status: 200,
      data,
    };
  }


}
