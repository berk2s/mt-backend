/**
 * When MongoDB connection has established
 * Then given callback method will be triggered
 */
export interface ConnectionCallback {
  (): void
}
