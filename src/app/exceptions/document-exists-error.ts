/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when a document exists
 *
 * @class
 * @alias app.exceptions.DocumentExists
 */
export class DocumentExists extends AppError {
  statusCode: number = 409
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, DocumentExists.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.EXISTS,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
