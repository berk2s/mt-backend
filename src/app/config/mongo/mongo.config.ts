/**
 * @module app.config.mongoConnection
 */
import mongoose from 'mongoose'
import { InvalidENVError } from '@app/exceptions/invalid-env-value'
import loggerService from '@app/services/logger/logger-service'
import { ConnectionCallback } from './mongo-connection.types'

/**
 * Mongo database connector class
 * @class
 * @alias app.config.MongoConnection
 */
class MongoConnection {
  /**
   * Holds connection state
   */
  private isConnectedBefore: boolean

  /**
   * Connection callback method
   */
  private onConnectionCallback!: ConnectionCallback

  /**
   * Mongo connection options to be passed Mongoose
   */
  private readonly mongoConnectionOptions: any = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  constructor() {
    this.isConnectedBefore = false

    mongoose.connection.on('error', this.onError)
    mongoose.connection.on('disconnected', this.onDisconnected)
    mongoose.connection.on('connected', this.onConnected)
    mongoose.connection.on('reconnected', this.onReconnected)
  }

  /**
   * Starts mongodb connection
   */
  public connect(onConnectionCallback: ConnectionCallback): void {
    this.onConnectionCallback = onConnectionCallback
    this.startConnection()

    this.onConnectionCallback()
  }

  private startConnection = () => {
    loggerService.info('MongoDB connection started')
    mongoose.connect(this.mongoUrl(), this.mongoConnectionOptions)
  }

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = () => {
    loggerService.info('Connectted to MongoDB')

    this.isConnectedBefore = true
    this.onConnectionCallback()
  }

  /**
   * Handler called when mongo gets re-connected to the database
   */
  private onReconnected = () => {
    loggerService.info('Reconnectted to MongoDB')

    this.onConnectionCallback()
  }

  /**
   * Handler called for mongo connection errors
   */
  private onError = () => {
    loggerService.warn("Couldn't connect to MongoDB")
  }

  /**
   * Handler called when mongo connection is lost
   */
  private onDisconnected = () => {
    if (!this.isConnectedBefore) {
      setTimeout(() => {
        this.startConnection()
      }, 2000)

      loggerService.info('Retrying to connect MongoDB')
    }
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
