/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when a document not found
 *
 * @class
 * @alias app.exceptions.DocumentNotFound
 */
export class DocumentNotFound extends AppError {
  statusCode: number = 409
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, DocumentNotFound.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.NOT_FOUND,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
