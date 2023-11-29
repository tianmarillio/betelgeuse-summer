import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>; // FIXME: needed?

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    authService = unit;
    usersService = unitRef.get(UsersService);
    jwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    // TODO: test bcrypt
    const registerUserDto: RegisterUserDto = {
      email: 'test@mail.com',
      password: '12341234',
    };

    it('should return undefined', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      const response = await authService.register(registerUserDto);

      expect(response).toBe(undefined);
    });

    it('should throw BadRequestException if email already exist', async () => {
      const findOneResponse = Promise.resolve(new User());
      usersService.findOneByEmail.mockResolvedValue(findOneResponse);

      const fn = async () => await authService.register(registerUserDto);

      await expect(fn).rejects.toThrow(
        new BadRequestException('Email already exist'),
      );

      // ALTERNATIVE METHOD
      // try {
      //   await authService.register(registerUserDto);
      // } catch (error) {
      //   expect(error).toEqual(new BadRequestException('Email already exist'));
      // }
    });
  });

  describe('login', () => {
    const loginUserDto = {
      email: 'test@mail.com',
      password: '12341234',
    };

    it('should return auth token', async () => {
      const user = new User();
      user.id = '12341234-0ecd-4933-ab6d-0c8f37fe0dc1';
      user.email = 'test@mail.com';
      user.password =
        '$2a$12$qLK0iz7cZyG1Fbcj7hDfVuiaNSkGa3JFkJfDvcOxdDNUzG3wfEMXy';
      // Decrypted password: 12341234

      const findOneResponse = Promise.resolve(user);
      usersService.findOneByEmail.mockResolvedValue(findOneResponse);

      const jwt = new JwtService({ secret: process.env.JWT_KEY });
      const signedToken = await jwt.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '1d',
        },
      );
      jwtService.signAsync.mockResolvedValue(signedToken);

      const response = await authService.login(loginUserDto);
      const decrypted = await jwt.verifyAsync(response.token);

      expect(response).toHaveProperty('token');
      expect(decrypted).toHaveProperty('id');
      expect(decrypted).toHaveProperty('email');
      expect(decrypted).toHaveProperty('iat');
      expect(decrypted).toHaveProperty('exp');
      expect(decrypted.id === user.id).toBe(true);
      expect(decrypted.email === user.email).toBe(true);
    });

    it('should throw BadRequestException if logged in user not found', async () => {
      const findOneResponse = Promise.resolve(null);
      usersService.findOneByEmail.mockResolvedValue(findOneResponse);

      const fn = async () => await authService.login(loginUserDto);

      await expect(fn).rejects.toThrow(
        new BadRequestException('Invalid credential'),
      );
    });

    it('should throw BadRequestException on wrong password', async () => {
      const user = new User();
      user.password =
        '$2a$12$qLK0iz7cZyG1Fbcj7hDfVuiaNSkGa3JFkJfDvcOxdDNUzG3wfEMXy';
      const findOneResponse = Promise.resolve(null);
      usersService.findOneByEmail.mockResolvedValue(findOneResponse);

      const wrongPassword = '123123123';
      const fn = async () =>
        await authService.login({ ...loginUserDto, password: wrongPassword });

      await expect(fn).rejects.toThrow(
        new BadRequestException('Invalid credential'),
      );
    });
  });
});
