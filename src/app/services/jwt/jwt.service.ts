/**
 * @module app.services.jwt
 */
import tokenConfig from '@app/config/token.config'
import { InvalidToken } from '@app/exceptions/invalid-token-error'
import fs from 'fs'
import jwt from 'jsonwebtoken'

/**
 * JWT Service
 * @class
 * @alias app.services.jwt.JWTService
 */
class JWTService {
  private privateKey: jwt.Secret

  constructor() {
    const privateKey = fs.readFileSync(
      `${__dirname}/../../../../rsa/private.key`,
    )
    this.privateKey = privateKey
  }
  /**
   * Generates JWT
   */
  public async generate(payload: any): Promise<string> {
    const token = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: tokenConfig.expiresIn,
    })

    return Promise.resolve(token)
  }

  public isTokenValid(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.privateKey, {
        algorithms: ['RS256'],
      })

      return decoded ? true : false
    } catch (err) {
      return false
    }
  }

  public verify(token: string): any {
    try {
      const decoded = jwt.verify(token, this.privateKey, {
        algorithms: ['RS256'],
      })

      return decoded
    } catch (err) {
      throw new InvalidToken('token.invalid')
    }
  }
}

export default new JWTService()
