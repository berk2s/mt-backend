/**
 * @module app.middlewares
 */

import { NextFunction, Response } from 'express'
import { BodyDTO, IncomingRequest } from '@app/types/controller.types'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { ErrorTypes } from '@app/types/error.types'
import loggerService from '@app/services/logger/logger-service'

/**
 * Validates request body with corresponding validation rules
 * @param dto
 * @returns Express middleware
 * @alias app.middlewares.bodyValidation
 */
export const bodyValidation = <T extends BodyDTO>(dto: BodyDTO | any) => {
  return async (req: IncomingRequest<T>, res: Response, next: NextFunction) => {
    const mappedClass: T = plainToInstance(dto, req.body)

    const validationErrors = await validate(mappedClass, {
      skipMissingProperties: true,
    })

    if (validationErrors.length > 0) {
      const errorDetails = validationErrors.map((val) => val.constraints)

      loggerService.warn(
        `The request body is not valid [requestBody: ${JSON.stringify(
          req.body,
        )}]`,
      )

      return res.status(400).send({
        error: ErrorTypes.INVALID_REQUEST,
        error_description: 'invalid.request',
        details: errorDetails,
      })
    } else {
      req.bodyDto = mappedClass
      next()
      return
    }
  }
}
