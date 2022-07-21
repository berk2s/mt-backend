/**
 * @module app.utilities
 */

/**
 * Date Utility
 *
 * @alias app.utilities.DateUtility
 */
export abstract class DateUtility {
  /**
   * Calculates how many days difference between two day
   */
  public static findDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime())

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
