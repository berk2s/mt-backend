import request from 'supertest'
import server from '@app/app'
import healthController from '@app/controllers/health/health.controller'

describe('Get ' + healthController.ENDPOINT, () => {
  it('should return successfully and application is live', async () => {
    const response = await request(server.app).get(healthController.ENDPOINT)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('OK')
  }, 30000)
})
