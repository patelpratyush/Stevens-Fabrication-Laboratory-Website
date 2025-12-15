import { getRedisClient } from '../config/redisConnection.js';

/**
 * Get value from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed JSON value or null if not found
 */
export async function getCache(key) {
  try {
    const redis = getRedisClient();
    const value = await redis.get(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`Redis GET error for key "${key}":`, error.message);
    return null; // Fail gracefully - don't crash if Redis is down
  }
}

/**
 * Set value in Redis cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} ttlSeconds - Time to live in seconds (default: 600 = 10 min)
 */
export async function setCache(key, value, ttlSeconds = 600) {
  try {
    const redis = getRedisClient();
    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
    console.log(`✓ Cached: ${key} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`Redis SET error for key "${key}":`, error.message);
    // Fail gracefully - don't crash if Redis is down
  }
}

/**
 * Delete a single cache key
 * @param {string} key - Cache key to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteCache(key) {
  try {
    const redis = getRedisClient();
    const deleted = await redis.del(key);
    
    if (deleted) {
      console.log(`✓ Invalidated cache: ${key}`);
    }
    
    return deleted > 0;
  } catch (error) {
    console.error(`Redis DEL error for key "${key}":`, error.message);
    return false;
  }
}

/**
 * Delete multiple cache keys matching a pattern
 * @param {string} pattern - Redis key pattern (e.g., "equipment:*")
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function deleteCachePattern(pattern) {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }
    
    const deleted = await redis.del(keys);
    console.log(`✓ Invalidated ${deleted} cache keys matching: ${pattern}`);
    
    return deleted;
  } catch (error) {
    console.error(`Redis pattern delete error for "${pattern}":`, error.message);
    return 0;
  }
}

/**
 * Check if a cache key exists
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} - True if key exists
 */
export async function cacheExists(key) {
  try {
    const redis = getRedisClient();
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`Redis EXISTS error for key "${key}":`, error.message);
    return false;
  }
}

/**
 * Get remaining TTL for a cache key
 * @param {string} key - Cache key
 * @returns {Promise<number>} - TTL in seconds, -1 if no expiry, -2 if key doesn't exist
 */
export async function getCacheTTL(key) {
  try {
    const redis = getRedisClient();
    return await redis.ttl(key);
  } catch (error) {
    console.error(`Redis TTL error for key "${key}":`, error.message);
    return -2;
  }
}

/**
 * Cache key generators for consistent naming
 */
export const CacheKeys = {
  // User cache
  user: (firebaseUid) => `user:${firebaseUid}`,
  
  // Equipment cache
  equipmentActive: () => 'equipment:active',
  equipmentById: (id) => `equipment:${id}`,
  equipmentAll: () => 'equipment:*',
  
  // Services cache
  servicesActive: () => 'services:active',
  serviceById: (id) => `service:${id}`,
  servicesAll: () => 'services:*',
  
  // Checkout cache (optional - if you want to cache checkout lists)
  checkoutsByUser: (firebaseUid) => `checkouts:user:${firebaseUid}`,
  checkoutsPending: () => 'checkouts:pending',
  checkoutsAll: () => 'checkouts:*'
};

/**
 * Common TTL values (in seconds)
 */
export const TTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  ONE_DAY: 86400
};

/**
 * Recommended cache TTLs for specific resources
 */
export const CacheTTL = {
  USER: TTL.ONE_HOUR,           // 1 hour
  EQUIPMENT: TTL.FIVE_MINUTES,  // 5 minutes
  SERVICE: TTL.ONE_HOUR,        // 1 hour
  CHECKOUT: TTL.ONE_MINUTE      // 1 minute (changes frequently)
};