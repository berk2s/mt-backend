/**
 * @module app.middlewares
 */

import jwtService from '@app/services/jwt/jwt.service'
import loggerService from '@app/services/logger/logger-service'
import { IncomingRequest } from '@app/types/controller.types'
import { ErrorTypes } from '@app/types/error.types'
import { NextFunction, Request, Response } from 'express'
/**
 * Checks and validates token in the request header
 */
export const tokenVerify = async (
  req: IncomingRequest<any>,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    loggerService.warn('There is no any Authorization header')
    sendErrorResponse(res)
    return
  }

  const splittedHeader = authorizationHeader.split(' ')
  const token = splittedHeader[1]

  const isValid = jwtService.isTokenValid(token)

  if (!isValid) {
    loggerService.warn('Access token is not valid, It might be expired')
    sendErrorResponse(res)
    return
  }

  try {
    const decoded: any = jwtService.verify(token)
    req.userId = decoded.userId
    req.userEmail = decoded.userEmail
  } catch (err) {
    loggerService.warn('Access token is not valid')
    sendErrorResponse(res)
    return
  }

  next()
}

const sendErrorResponse = (res: Response) => {
  res.status(401).send({
    error: ErrorTypes.INVALID_GRANT,
    error_description: 'token.invalid',
    details: [],
  })
}
