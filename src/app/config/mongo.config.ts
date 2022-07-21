/**
 * @module app.config
 */
import mongoose from 'mongoose'
import { InvalidENVError } from '@app/exceptions/invalid-env-value'

/**
 * Mongo database connector class
 * @class
 * @alias app.controllers.healthController
 */
class MongoConnection {
  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: any = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  /**
   * Starts mongodb connection
   */
  public connect(): void {
    mongoose.connect(this.mongoUrl(), this.mongoConnectionOptions)
  }

  /**
   * Gets mongo connection url from ENV
   * Then, returns the connection url
   * @returns - Connection URL
   */
  private mongoUrl(): string {
    const { MONGO_CONNECTION_URL } = process.env

    if (!MONGO_CONNECTION_URL || typeof MONGO_CONNECTION_URL === 'undefined') {
      throw new InvalidENVError('internal.error')
    }

    return MONGO_CONNECTION_URL as string
  }
}

export default new MongoConnection()
