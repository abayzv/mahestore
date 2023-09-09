import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn((email: string, password: string) => {
      if (email === 'test' && password === 'test') {
        return {
          accessToken: 'acces_token',
          refreshToken: 'refresh_token'
        }
      }

      return {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }),
    me: jest.fn((token: string) => {
      if (token === "access_token") {
        return {
          id: 1,
          name: 'test',
          email: 'test',
          role: 'admin'
        }
      }

      return {
        statusCode: 401,
        message: 'Unauthorized'
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        JwtModule.register({}),
      ],
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {

    it('should return a acces token', async () => {
      const login = {
        email: "test",
        password: "test"
      }

      const result = await controller.login(login);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should return a error', async () => {
      const login = {
        email: "test",
        password: "test1"
      }

      const result = await controller.login(login);

      expect(result.statusCode).toBe(401);
      expect(result.message).toBe('Unauthorized');
    });

  });

  describe('me', () => {

    it('should return a user', async () => {

      const req: Request = {
        headers: {
          authorization: 'Bearer access_token'
        },
      } as Request;

      const result = await controller.me(req);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
    });

    it('should return a error', async () => {

      const req: Request = {
        headers: {
          authorization: 'Bearer access_token1'
        },
      } as Request;

      const result = await controller.me(req);

      expect(result.statusCode).toBe(401);
      expect(result.message).toBe('Unauthorized');

    });

  });
});
