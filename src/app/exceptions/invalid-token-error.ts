/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when token invalid
 *
 * @class
 * @alias app.exceptions.InvalidToken
 */
export class InvalidToken extends AppError {
  statusCode: number = 401
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, InvalidToken.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.INVALID_GRANT,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
