import { SocketError } from '@app/exceptions/socket-error'
import jwtService from '@app/services/jwt/jwt.service'
import loggerService from '@app/services/logger/logger-service'

const socketTokenVerify = (socket: any, next: any) => {
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

export default socketTokenVerify
