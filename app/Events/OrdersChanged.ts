import { Event } from '@guren/core'

/** Sent when any order changes; the kitchen board reloads its `orders` prop. */
export class OrdersChanged extends Event {
  static override eventName = 'OrdersChanged'

  broadcastOn(): string[] {
    return ['orders']
  }
}
