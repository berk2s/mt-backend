/**
 * @module app.services.jwt
 */
import tokenConfig from '@app/config/token.config'
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
    const token = await jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: tokenConfig.expiresIn,
    })

    return Promise.resolve(token)
  }
}

export default new JWTService()
