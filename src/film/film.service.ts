import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AppDataSource } from '../database/data-source';
import * as NodeCache from 'node-cache';

@Injectable()
export class FilmService {
  private readonly memoryCache = new NodeCache({
    stdTTL: parseInt(process.env.NODE_CACHE_TTL),
  });
  private readonly fetchingPromises = new Map<string, Promise<any>>();

  constructor(private readonly redisService: RedisService) {}

  async getFilmByTitle(title: string) {
    const cacheKey = `film:${title}`;

    // Logging at each step
    console.log(`Request to fetch film with title: ${title}`);

    // Check for cached data in Node's memory cache
    const cachedFilmMemory = this.memoryCache.get(cacheKey);
    if (cachedFilmMemory) {
      console.log(`Found in Node's memory cache: ${title}`);
      return cachedFilmMemory;
    }

    // Check for cached data in Redis
    const cachedFilmRedis = await this.redisService.get(cacheKey);
    if (cachedFilmRedis) {
      console.log(`Found in Redis cache: ${title}`);
      // Cache in Node's memory
      this.memoryCache.set(
        cacheKey,
        JSON.parse(cachedFilmRedis),
        parseInt(process.env.NODE_CACHE_TTL || '15'),
      ); // TTL for Node's memory cache
      return JSON.parse(cachedFilmRedis);
    }

    // Check for other pending requests for the same film (to avoid duplicate queries)
    if (this.fetchingPromises.has(title)) {
      console.log(`Request for film "${title}" is in process, waiting...`);
      // If another request for the same film is in progress, wait for it to finish
      return this.fetchingPromises.get(title);
    }

    // Create a promise for querying the database
    console.log(
      `Film "${title}" not found in caches, querying the database...`,
    );
    const filmPromise = this.fetchFilmFromDatabaseAndCache(title);
    this.fetchingPromises.set(title, filmPromise);

    // Wait for the promise to resolve
    const film = await filmPromise;

    // Remove the promise after completion
    this.fetchingPromises.delete(title);

    return film;
  }

  private async fetchFilmFromDatabaseAndCache(title: string) {
    console.log(`Querying the database for film: ${title}`);

    // Artificial delay for testing the queue
    const fetchDelay = parseInt(process.env.FETCH_DELAY_MS);
    console.log(`Timer for ${fetchDelay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, fetchDelay));

    // Query the database
    const film = await AppDataSource.createQueryBuilder()
      .select('film')
      .from('film', 'film')
      .where('film.title = :title', { title })
      .getRawOne();

    if (film) {
      console.log(`Film "${title}" found in the database.`);

      // Cache in Redis for 30 seconds
      const cacheKey = `film:${title}`;
      const redisTTL = parseInt(process.env.REDIS_CACHE_TTL || '30');
      await this.redisService.set(cacheKey, JSON.stringify(film), redisTTL);
      console.log(`Caching in Redis for film "${title}" completed.`);

      // Cache in Node's memory for 15 seconds
      const nodeCacheTTL = parseInt(process.env.NODE_CACHE_TTL || '15');
      this.memoryCache.set(cacheKey, film, nodeCacheTTL);
      console.log(`Caching in Node's memory for film "${title}" completed.`);

      return film;
    } else {
      console.log(`Film "${title}" not found in the database.`);
      return null; // If film is not found
    }
  }
}
