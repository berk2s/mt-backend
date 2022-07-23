/**
 * @module app.exceptions
 */

import { ErrorResponse, ErrorTypes } from '@app/types/error.types'
import { AppError } from './app-error'

/**
 * Can be thrown when something happened bad from Stripe side
 *
 * @class
 * @alias app.exceptions.StripeError
 */
export class StripeError extends AppError {
  statusCode: number = 400
  errorDesc: string

  /**
   * @constructor
   * @param err - Message of thrown error
   */
  constructor(err: string) {
    super(err)

    this.errorDesc = err

    Object.setPrototypeOf(this, StripeError.prototype)
  }

  serializeError(): ErrorResponse {
    return {
      error: ErrorTypes.PAYMENT_ERROR,
      error_description: this.errorDesc,
      details: [],
    }
  }
}
