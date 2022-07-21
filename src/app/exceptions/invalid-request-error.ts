/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when a request is inavlid
 *
 * @class
 * @alias app.exceptions.InvalidRequest
 */
export class InvalidRequest extends AppError {
  statusCode: number = 400
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, InvalidRequest.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.INVALID_REQUEST,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
