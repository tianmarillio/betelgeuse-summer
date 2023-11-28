import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    const { password, ...rest } = user;

    return rest;
  }

  async findOneByEmail(email: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ email });
    const { password, ...rest } = user;

    return rest;
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }
}
