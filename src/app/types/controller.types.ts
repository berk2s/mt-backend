/**
 * @module app.types
 */

import { Request } from 'express'

/**
 * Generic request interface
 * 'body' holds raw string which added to the body
 *  while sending the request
 */
export interface IncomingRequest<T extends BodyDTO> extends Request {
  body: any
  bodyDto: T
}

/**
 * Abstract BodyDTO
 * All DTOs extend this abstact class
 */
export abstract class BodyDTO {}
