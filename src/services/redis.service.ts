import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;

  constructor() {}

  onModuleInit() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    });
<<<<<<< HEAD
    console.log(`🚀 Redis connected on PORT ${process.env.REDIS_PORT}`);
  }

  async get(key: string, value: string, ttl?: number): Promise<void> {
=======
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
>>>>>>> 0.13
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

<<<<<<< HEAD
  async getCache(key: string): Promise<string | null> {
=======
  async get(key: string): Promise<string | null> {
>>>>>>> 0.13
    return await this.redis.get(key);
  }

  async delete(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}
