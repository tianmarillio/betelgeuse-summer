import * as bcrypt from 'bcrypt';
// TODO: move bcrypt to helper for easier testing

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.findOneByEmail(registerUserDto.email);

    if (!!user) {
      throw new BadRequestException('Email already exist');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(registerUserDto.password, salt);

    await this.usersService.create({
      email: registerUserDto.email,
      password: hash,
    });

    return;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credential');
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credential');
    }

    const { id, email } = user;
    const token = await this.jwtService.signAsync({
      id,
      email,
    });

    return { token };
  }
}
