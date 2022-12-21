/**
 * @module app.middlewares
 */

import { ErrorTypes } from '@app/types/error.types'
import { AppError } from '@app/exceptions/app-error'
import { NextFunction, Request, Response } from 'express'
import loggerService from '@app/services/logger/logger-service'

/**
 * Global error handler middleware
 * @param err
 * @param req
 * @param res
 * @param next
 * @alias app.middlewares.errorHandler
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError)
    return res.status(err.statusCode).send(err.serializeError())

  loggerService.warn(`Unknown error: ${err}`)

  return res.status(400).send({
    error: ErrorTypes.UNKNOWN_ERROR,
    error_description: 'error.unknown',
    detail: err,
  })
}
