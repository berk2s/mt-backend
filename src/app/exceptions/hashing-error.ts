/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when hashing failed
 *
 * @class
 * @alias app.exceptions.HashingError
 */
export class HashingError extends AppError {
  statusCode: number = 500
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, HashingError.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.INTERNAL_ERROR,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
