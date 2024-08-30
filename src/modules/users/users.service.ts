import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private entityManager: EntityManager,
  ) { }

  // create user
  async register(body: { username: string, mail: string, password: string }) {
    // Check if user already exists
    const existingUser = await this.entityManager.query(
      `SELECT * FROM users WHERE username = ? OR mail = ?`,
      [body.username, body.mail]
    );

    console.log(existingUser, "existingUserexistingUser")

    if (existingUser.length > 0) {
      return 'User already exists with this username or email';
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Insert the new user
    const result = await this.entityManager.query(
      `INSERT INTO users (username, password, mail) VALUES (?, ?, ?)`,
      [body.username, hashedPassword, body.mail]
    );

    // Fetch the inserted user
    const newUser = await this.entityManager.query(
      `SELECT * FROM users WHERE id = ?`,
      [result.insertId]
    );

    delete newUser[0].password;

    return newUser[0]; // Return the newly created user
  }


  async login(body: { mail: string; password: string }) {
    // Check if user already exists
    const existingUser = await this.entityManager.query(
      `SELECT * FROM users WHERE mail = ?`,
      [body.mail]
    );

    console.log(existingUser, "existingUserexistingUser")

    if (existingUser.length === 0) {
      return 'User does not exist, please register.';
    }

    // Hash the password
    const isPasswordValid = await bcrypt.compare(body.password, existingUser[0].password);
    console.log(isPasswordValid, 'isPasswordValid');

    if (!isPasswordValid) {
      return 'Please enter a correct password.';
    }

    return ('Successfully logged in!')
  }


  // find all users
  async findAll() {
    const allUsers = await this.entityManager.query(
      `SELECT * FROM users`,
    );

    return allUsers
  }


  // find single user
  async findOne(id: string) {
    const getUser = await this.entityManager.query(
      `SELECT * FROM users where id= ${id}`,
    );

    console.log(getUser, 'getUser');

    if (getUser.length > 0) {
      return getUser[0]
    } else {
      throw new HttpException('No user found based on Id', HttpStatus.NOT_FOUND);
    }
  }


  async delete(id: string) {
    const getUser = await this.entityManager.query(
      `SELECT * FROM users where id= ${id}`,
    );

    if (getUser.length == 0) {
      throw new HttpException('No user found based on Id', HttpStatus.NOT_FOUND)
    }

    const result = await this.entityManager.query(
      `DELETE FROM users WHERE id = ${id}`
    );

    console.log(result, 'result')

    if (result.affectedRows === 1) {
      return { message: 'User deleted successfully' };
    } else {
      throw new HttpException('No user found based on Id', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, body: { username: string, mail: string }) {
    const getUser = await this.entityManager.query(
      `SELECT * FROM users where id= ${id}`,
    );

    if (getUser.length == 0) {
      throw new HttpException('No user found based on Id', HttpStatus.NOT_FOUND)
    }

    // Perform the update operation
    const result = await this.entityManager.query(
      'UPDATE users SET username = ?, mail = ? WHERE id = ?',
      [body.username, body.mail, id]
    );

    if (result.affectedRows === 1) {
      return {
        "statusCode": 200,
        "message": "updated user succssfully"
      }
    } else {
      throw new HttpException('No user found based on Id', HttpStatus.NOT_FOUND);
    }
  }

  async getUsers() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      return response.data;
    } catch (error) {
      // Handle error appropriately
      throw new Error('Error fetching users');
    }
  }


}
