/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when the user is not authorized for a action
 *
 * @class
 * @alias app.exceptions.UnauthorizedError
 */
export class UnauthorizedError extends AppError {
  statusCode: number = 403
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.UNAUTHORIZED,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
