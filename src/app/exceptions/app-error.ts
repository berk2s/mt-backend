/**
 * @module app.exceptions
 */

import { ErrorResponse } from '@app/types/error.types'

/**
 * Base class of all throwable exception in the app
 *
 * @class
 * @alias app.exceptions.AppError
 */
export abstract class AppError extends Error {
  /**
   * Thrown error HTTP status code
   */
  abstract statusCode: number

  /**
   * Thrown error message
   */
  abstract errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    Object.setPrototypeOf(this, AppError.prototype)
  }

  /**
   * Serializes error to http response
   * @returns an object that contains error name and description
   */
  abstract serializeError(): ErrorResponse
}
