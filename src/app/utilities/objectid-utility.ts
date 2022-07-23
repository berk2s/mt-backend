/**
 * @module app.utilities
 */

export abstract class ObjectIdUtility {
  /**
   * Checks whether given document ID is valid or not
   */
  public static isValid(id: string) {
    return id.match(/^[0-9a-fA-F]{24}$/) !== null
  }
}
