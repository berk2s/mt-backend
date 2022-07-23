/**
 * @module app.utilities
 */

export abstract class RandomUtility {
  /**
   * Generates random string within given length
   */
  public static randomString(length: number): string {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }
}
