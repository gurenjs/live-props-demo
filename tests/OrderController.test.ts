import { beforeAll, describe, expect, it } from 'bun:test'
import { TestApp, readInertiaResponse } from '@guren/testing'
import app from '../src/app.js'

// Boots the real src/app.ts so tests share its configuration.
describe('orders', () => {
  let http: TestApp

  beforeAll(async () => {
    http = await TestApp.fromApp(app)
  })

  it('renders the kitchen board with a live orders prop', async () => {
    const response = await http.get('/').assertOk()
    const { payload } = await readInertiaResponse(response.raw)

    expect(payload.component).toBe('orders/Board')
    expect(payload.liveProps?.orders?.listeners).toEqual([
      { channel: { name: 'orders', type: 'public' }, events: ['OrdersChanged'] },
    ])
  })

  it('renders the tracking page with a live order prop on its own channel', async () => {
    const response = await http.get('/orders/2').assertOk()
    const { payload } = await readInertiaResponse(response.raw)

    expect(payload.component).toBe('orders/Show')
    expect(payload.liveProps?.order?.listeners).toEqual([
      { channel: { name: 'orders.2', type: 'public' }, events: ['OrderUpdated'] },
    ])
  })

  it('answers the health check', async () => {
    await http.get('/health').assertOk()
  })
})
