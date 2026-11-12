import { Event } from '@guren/core'

/** Sent when one order changes; its tracking page reloads the `order` prop. */
export class OrderUpdated extends Event {
  static override eventName = 'OrderUpdated'

  constructor(readonly orderId: number) {
    super()
  }

  broadcastOn(): string[] {
    return [`orders.${this.orderId}`]
  }

  broadcastWith(): Record<string, unknown> {
    return { orderId: this.orderId }
  }
}
