/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Invalid ENV
 * This exception will be thrown
 * while trying to access an ENV value
 * but it is not defined or null
 *
 * @class
 * @alias app.exceptions.InvalidEnvError
 */
export class InvalidENVError extends AppError {
  statusCode: number = 500
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, InvalidENVError.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.INTERNAL_ERROR,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
