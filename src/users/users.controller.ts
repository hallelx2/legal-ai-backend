import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UpdateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch all users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Fetch a single user by ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  // Create a new user
  // @Post()
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.register(createUserDto);
  // }

  // Update a user by ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  // Delete a user by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
