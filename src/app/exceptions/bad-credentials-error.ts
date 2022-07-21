/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when email or password wrong
 *
 * @class
 * @alias app.exceptions.BadCredentials
 */
export class BadCredentials extends AppError {
  statusCode: number = 401
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, BadCredentials.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.BAD_CREDENTIALS,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
