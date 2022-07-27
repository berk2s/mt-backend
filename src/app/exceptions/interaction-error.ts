/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when a user reaches like limit
 *
 * @class
 * @alias app.exceptions.BadCredentials
 */
export class InteractionError extends AppError {
  statusCode: number = 409
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, InteractionError.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.INTERACTION_ERROR,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
