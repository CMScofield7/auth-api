import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../redis.service';
import Redis from 'ioredis-mock';
import { redisData, redisDeleteResult } from '../mocks/redis.service.mock';

describe('RedisService', () => {
  let redisService: RedisService;
  let redisClient: InstanceType<typeof Redis>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS',
          useValue: redisClient,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    redisClient = new Redis();
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });

  it('should set a key with ttl', async () => {
    await redisClient.set(redisData.key, redisData.value, 'EX', redisData.ttl);
    const value = await redisClient.get(redisData.key);
    expect(value).toBe(redisData.value);
  });

  it('should set a key without ttl', async () => {
    await redisClient.set(redisData.key, redisData.value);
    const value = await redisClient.get(redisData.key);
    expect(value).toBe(redisData.value);
  });

  it('should get a key', async () => {
    await redisClient.set(redisData.key, redisData.value);
    const result = await redisService.get(redisData.key);
    expect(result).toBe(redisData.value);
  });

  it('should delete a key', async () => {
    await redisClient.set(redisData.key, redisData.value);
    const result = await redisService.delete(redisData.key);
    expect(result).toBe(redisDeleteResult);
  });
});
