/**
 * @module app.config.socket
 */

import { SocketError } from '@app/exceptions/socket-error'
import jwtService from '@app/services/jwt/jwt.service'
import loggerService from '@app/services/logger/logger-service'
import { Server } from 'socket.io'
import appConfig from '../app.config'

/**
 * Socketio connector class
 * @class
 * @alias app.config.socket.SocketIOConnetcion
 */
class SocketIOConnetcion {
  public socket: Server

  constructor() {
    this.socket = new Server<any>({
      cors: {
        origin: appConfig.frontendURL,
      },
    })

    this.socket.on('connection', this.onConnection)
    this.socket.on('connect_error', this.onError)

    this.socket.use(this.tokenVerify)
  }

  public onConnection(socket: any) {}

  public tokenVerify(socket: any, next: any) {
    const token = socket.handshake.auth.token

    if (!token) {
      loggerService.warn(`Invalid token in the socket`)
      return next(new SocketError('invalid.token'))
    }

    const isValid = jwtService.isTokenValid(token)

    if (!isValid) {
      loggerService.warn(`Invalid token in the socket`)
      return next(new SocketError('invalid.token'))
    }

    const decoded: any = jwtService.verify(token)

    socket.token = token
    socket.userId = decoded.userId
    next()
  }

  public onError(err) {
    loggerService.warn(
      `An error occured in the socket coonection [error: ${err}]`,
    )
  }
}

export default new SocketIOConnetcion()
