import { RedisService } from 'src/services/redis.service';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  imports: [],
  providers: [
    RedisService,
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST ?? 'redis',
          port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        });
      },
    },
  ],
  exports: [RedisService, 'REDIS'],
})
export class RedisModule {
  constructor() {
    console.log(process.env.REDIS_HOST);
  }
}
