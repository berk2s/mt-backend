/**
 * @module app.services.stripe
 */

export interface CreatePrice {
  unit_amount: number
  currency: string
  recurring: { interval: any }
  product: string
  lookup_key: string
}
