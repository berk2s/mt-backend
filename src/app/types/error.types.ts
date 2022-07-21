/**
 * @module app.types
 */

/**
 * Exception Response DTO
 *
 * When an exception has thrown
 * this schema will be returned to the client
 */
export interface ErrorResponse {
  error: string
  error_description: string
  details: any
}

/**
 * Error types
 *
 * These types will be placed at "error" field of ErrorResponse
 */
export enum ErrorTypes {
  INTERNAL_ERROR = 'internal_error',
  INVALID_REQUEST = 'invalid_request',
  UNKNOWN_ERROR = 'unknown_error',
  EXISTS = 'exists',
  NOT_FOUND = 'not_found',
  BAD_CREDENTIALS = 'bad_credentials',
  INVALID_GRANT = 'invalid_grant',
}
