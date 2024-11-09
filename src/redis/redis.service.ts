import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = +process.env.REDIS_PORT || 6379;

    console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
    });

    this.client.on('error', (err) => console.error('Redis error:', err));
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.client.set(key, value, 'EX', ttl);
  }
}
