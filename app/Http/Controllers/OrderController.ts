import { Controller, live, type BroadcastManager } from '@guren/core'
import { z } from 'zod'
import { pages } from '@/.guren/pages.gen'
import { OrderUpdated } from '@/app/Events/OrderUpdated'
import { OrdersChanged } from '@/app/Events/OrdersChanged'
import { ORDER_STEPS, Order, type OrderStatus } from '@/app/Models/Order'

const OrderIdParams = z.object({ id: z.coerce.number().int().positive() })

const SEED_STATUS: Record<number, OrderStatus> = { 1: 'preparing', 2: 'received', 3: 'received', 4: 'ready' }

export default class OrderController extends Controller {
  async board(): Promise<Response> {
    const orders = await Order.orderBy('id')
    return this.inertia(
      pages.orders.Board,
      { orders: live(orders, { on: new OrdersChanged() }) },
      { title: 'Kitchen | Guren Diner' },
    )
  }

  async show(): Promise<Response> {
    const { id } = this.validateParams(OrderIdParams)
    const order = await Order.findOrFail(id)
    return this.inertia(
      pages.orders.Show,
      { order: live(order, { on: new OrderUpdated(order.id) }) },
      { title: `Order #${order.id} | Guren Diner` },
    )
  }

  async advance(): Promise<Response> {
    const { id } = this.validateParams(OrderIdParams)
    const order = await Order.findOrFail(id)
    const next = ORDER_STEPS[Math.min(ORDER_STEPS.indexOf(order.status as OrderStatus) + 1, ORDER_STEPS.length - 1)]!
    await this.#setStatus(order.id, next)
    return this.redirect('/')
  }

  /** Puts the demo back to its seeded state. */
  async reset(): Promise<Response> {
    for (const [id, status] of Object.entries(SEED_STATUS)) await this.#setStatus(Number(id), status)
    return this.redirect('/')
  }

  async #setStatus(id: number, status: OrderStatus): Promise<void> {
    await Order.update({ id }, {}, { set: { status, updatedAt: new Date().toISOString() } })
    const broadcast = this.make<BroadcastManager>('broadcast')
    await broadcast.broadcastEvent(new OrderUpdated(id))
    await broadcast.broadcastEvent(new OrdersChanged())
  }
}
