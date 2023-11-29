// import { Test, TestingModule } from '@nestjs/testing';
import { TestBed } from '@automock/jest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    authController = unit;
    authService = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it ('should return undefined', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@mail.com',
        password: '12341234',
      };

      authService.register.mockResolvedValue(undefined);
      const response = await authController.register(registerUserDto)

      expect(response).toBe(undefined);

    })
  });

  describe('login', () => {
    it('should return object with auth token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@mail.com',
        password: '12341234',
      };
      const loginResponse = {
        token: '<jwt_token>',
      };

      authService.login.mockResolvedValue(loginResponse);
      const response = await authController.login(loginUserDto);

      expect(response).toEqual(loginResponse);
    });


  });

  // TODO: test invalid emails
});
