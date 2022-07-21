/**
 * @module app.utilities
 */
import { HashingError } from '@app/exceptions/hashing-error'
import bcrypt from 'bcryptjs'

export abstract class HashUtility {
  /**
   * Hashes given raw string
   */
  public static async hash(raw: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedRaw = await bcrypt.hash(raw, salt)

      return Promise.resolve(hashedRaw)
    } catch (err) {
      throw new HashingError('hashing.failed')
    }
  }

  public static async compare(rawString, hashedString): Promise<boolean> {
    try {
      const matches = await bcrypt.compare(rawString, hashedString)

      return matches
    } catch (err) {
      throw new HashingError('hashing.failed')
    }
  }
}
