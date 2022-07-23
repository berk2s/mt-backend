/**
 * @module app.config
 */

const stripeConfig = {
  apiVersion: '2020-08-27',
  apiKey: process.env['STRIPE_KEY'],
  apiSecret: process.env['STRIPE_SECRET'],
  webhookKey: process.env['STRIPE_WEBHOOK_KEY'],
  success_url:
    'http://localhost:3000/subscription?success=true&session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'http://localhost:3000/subscription?canceled=true',
}

export default stripeConfig
