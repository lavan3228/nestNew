// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    console.log('CacheManager instance:', this.cacheManager);
    console.log('CacheManager set method:', this.cacheManager.set);
   }

  getHello(): string {
    return 'Hello World!';
  }

  async setTestCache() {
    console.log('Setting cache');
    await this.cacheManager.set('test-key', 'test-value', 600);
    console.log('Cache set');
  }

  async getTestCache() {
  return this.cacheManager.get('test-key');
}

  // async setCacheKey(key: string, value: string): Promise<void> {
  //   await this.cacheManager.set(key, value);
  // }

  // async getCacheKey(key: string): Promise<string> {
  //   return await this.cacheManager.get(key);
  // }

  // async deleteCacheKey(key: string): Promise<void> {
  //   await this.cacheManager.del(key);
  // }

  // async resetCache(): Promise<void> {
  //   await this.cacheManager.reset();
  // }

  // async cacheStore(): Promise<string[]> {
  //   return await this.cacheManager.store.keys();
  // }

}
