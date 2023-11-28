import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
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
    const user = await this.usersService.findOneByEmailWithPassword(
      registerUserDto.email,
    );

    if (user) {
      return 'email already exist'; // TODO: handle error
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
    const user = await this.usersService.findOneByEmailWithPassword(
      loginUserDto.email,
    );

    if (!user) {
      return 'invalid credential'; // TODO: handle error
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) {
      return 'invalid credential'; // TODO: handle error
    }

    const { id, email } = user;
    const token = await this.jwtService.signAsync({
      id,
      email,
    });

    return { token };
  }
}
