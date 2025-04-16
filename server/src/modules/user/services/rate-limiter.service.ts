import { Injectable } from '@nestjs/common';

const FIRST_FAILD_ATTEMPTS_COUNT = 3;
const SECOND_FAILD_ATTEMPTS_COUNT = 5;
const FIRST_BLOCK_DURATION = 60 * 60 * 1000; // 1 hour
const SECOND_BLOCK_DURATION = 24 * 60 * 60 * 1000; // 1 day
const THIRD_BLOCK_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Stores tracking data for each IP address.
 * - `attempts`: number of failed login attempts within the current strike window
 * - `strike`: number of times this IP has been blocked
 * - `blockExpiresAt`: timestamp (in ms) until which the IP is blocked
 */
type IPRecord = {
  attempts: number;
  strike: number;
  blockExpiresAt: number | null;
};

@Injectable()
export class RateLimiterService {
  private ipRecords: Map<string, IPRecord> = new Map();

  /**
   * Returns the block duration in milliseconds based on the number of strikes.
   * @param {number} strike - Number of prior blocks
   * @returns {number} Block duration in milliseconds
   */
  private getBlockDuration(strike: number): number {
    if (strike === 1) return FIRST_BLOCK_DURATION;
    if (strike === 2) return SECOND_BLOCK_DURATION;
    return THIRD_BLOCK_DURATION;
  }

  /**
   * Returns the number of allowed failed attempts based on strike count.
   * @param {number} strike - Number of prior blocks
   * @returns {number} Maximum allowed failed attempts
   */
  private getMaxAttempts(strike: number): number {
    if (strike === 0) return FIRST_FAILD_ATTEMPTS_COUNT;
    return SECOND_FAILD_ATTEMPTS_COUNT;
  }

  /**
   * Express middleware that checks if the IP has exceeded its allowed failed attempts.
   * If the IP is currently blocked, responds with HTTP 429.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   */
  blockIfTooManyFailedLogins(ip: string): string | null {
    const now = Date.now();
    const record = this.ipRecords.get(ip);

    if (record && record.blockExpiresAt && record.blockExpiresAt > now) {
      const wait = Math.ceil((record.blockExpiresAt - now) / 1000);
      return `Too many failed attempts. Try again in ${Math.ceil(wait / 60)} minutes.`;
    }

    return null;
  }

  /**
   * Registers a failed login attempt for the given IP.
   * - Increments attempt count
   * - Applies block if max attempts are exceeded
   *
   * @param {string} ip - IP address of the client
   */
  registerFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = this.ipRecords.get(ip) || {
      attempts: 0,
      strike: 0,
      blockExpiresAt: null,
    };

    const maxAttempts = this.getMaxAttempts(record.strike);
    record.attempts += 1;

    if (record.attempts >= maxAttempts) {
      record.strike += 1;
      record.blockExpiresAt = now + this.getBlockDuration(record.strike);
      record.attempts = 0;
    }

    this.ipRecords.set(ip, record);
  }

  /**
   * Resets the failed attempt and block status for a given IP.
   * Should be called after a successful login.
   *
   * @param {string} ip - IP address to reset
   */
  resetFailedAttempts(ip: string): void {
    const record = this.ipRecords.get(ip);
    if (record) {
      record.attempts = 0;
      record.blockExpiresAt = null;
      this.ipRecords.set(ip, record);
    }
  }

  /**
   * Clears all expired IP records.
   * Should be called periodically (e.g., via a cron job).
   *
   * Removes records where:
   * - The block has expired (blockExpiresAt < now)
   * - AND there are no current failed attempts
   */
  clearExpiredIpRecords(): void {
    const now = Date.now();

    for (const [ip, record] of this.ipRecords.entries()) {
      const isBlockedExpired =
        record.blockExpiresAt !== null && record.blockExpiresAt < now;
      const isIdle = record.attempts === 0;

      if (isBlockedExpired && isIdle) {
        this.ipRecords.delete(ip);
      }
    }
  }
}
