import { type BroadcastManager, getRequestContainer, Router } from '@guren/core'
import OrderController from '../app/Http/Controllers/OrderController.js'

export function registerWebRoutes(router: Router): void {
  router.get('/', [OrderController, 'board']).name('orders.board')
  router.get('/orders/:id', [OrderController, 'show']).name('orders.show')
  router.post('/orders/reset', [OrderController, 'reset']).name('orders.reset')
  router.post('/orders/:id/advance', [OrderController, 'advance']).name('orders.advance')

  // Live props subscribe over this socket.
  router
    .get('/broadcasting/socket', (c, next) =>
      getRequestContainer(c).make<BroadcastManager>('broadcast').webSocketMiddleware()(c, next),
    )
    .name('broadcasting.socket')

  // Health check endpoint for load balancers and uptime monitors
  router.get('/health', (c) => c.json({ status: 'ok' }))
}
