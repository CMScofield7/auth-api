import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/services/auth.service';
import { data, tokens } from 'src/services/mocks/auth.service.mock';
import { UserService } from 'src/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/services/redis.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserByID: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw NotFoundException if user not found', async () => {
      userService.findUserByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        authService.validateUser(data.email, data.password),
      ).rejects.toThrow(NotFoundException);
    });

    it('should generate tokens if user is found and password is correct', async () => {
      const user = {
        id: 1,
        name: 'Test',
        lastname: 'User',
        email: data.email,
        password: await bcrypt.hash(data.password, 10), // Senha criptografada
        role: 'user',
      };

      userService.findUserByEmail = jest.fn().mockResolvedValue(user);
      userService.findUserByID = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue(tokens.access_token);
      redisService.set = jest.fn();
      jest.spyOn(bcrypt, 'compare' as any).mockReturnValue(true);

      const result = await authService.validateUser(data.email, data.password);

      expect(result).toEqual(tokens);
      expect(userService.findUserByEmail).toHaveBeenCalledWith(data.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(data.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
        { expiresIn: '10m' },
      );

      expect(redisService.set).toHaveBeenCalledWith(
        expect.stringContaining('refreshToken'),
        expect.stringContaining(`"userId":${user.id}`),
        expect.any(Number) as number,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: 1,
        name: 'Test',
        lastname: 'User',
        email: data.email,
        password: await bcrypt.hash(data.password, 10), // Senha criptografada
        role: 'user',
      };

      userService.findUserByEmail = jest.fn().mockResolvedValue(user);
      userService.findUserByID = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue(tokens.access_token);
      redisService.set = jest.fn();
      jest.spyOn(bcrypt, 'compare' as any).mockReturnValue(false);

      await expect(
        authService.validateUser(data.email, data.password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findRefreshToken', () => {
    it('should return the refresh token if refresh token is found', async () => {
      redisService.get = jest.fn().mockResolvedValue('refreshToken');

      const result = await authService.findRefreshToken('refreshToken');
      expect(result).toEqual('refreshToken');
    });

    it('should throw UnauthorizedException if refresh token is not found', async () => {
      redisService.get = jest.fn().mockResolvedValue(null);

      await expect(
        authService.findRefreshToken('refreshToken'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update the refresh token and return new tokens', async () => {
      const payload = {
        id: 1,
        name: 'Test',
        lastname: 'User',
        email: data.email,
        role: 'user',
      };

      redisService.get = jest
        .fn()
        .mockResolvedValue(
          JSON.stringify({ userId: payload.id, token: tokens.refresh_token }),
        );
      userService.findUserByID = jest.fn().mockResolvedValue(payload);
      jwtService.sign = jest.fn().mockReturnValue(tokens.access_token);
      redisService.set = jest.fn();
      redisService.delete = jest.fn();

      const result = await authService.updateRefreshToken(tokens.refresh_token);

      expect(result).toEqual({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: payload.id,
        }),
        { expiresIn: '10m' },
      );
      expect(redisService.set).toHaveBeenCalledWith(
        expect.stringContaining('refreshToken'),
        expect.stringContaining(`"userId":${payload.id}`),
        expect.any(Number) as number,
      );
      expect(redisService.delete).toHaveBeenCalledWith(
        `refreshToken:${tokens.refresh_token}`,
      );
    });
  });
});
