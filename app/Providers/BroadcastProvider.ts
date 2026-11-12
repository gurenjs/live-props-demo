import { ServiceProvider, createBroadcastManager, MemoryBroadcastDriver, type BroadcastManager } from '@guren/core'

export default class BroadcastProvider extends ServiceProvider {
  register(): void {
    this.container.instance('broadcast', createBroadcastManager({
      default: 'memory',
      drivers: {
        memory: () => new MemoryBroadcastDriver(),
      },
    }))
  }

  boot(): void {
    const broadcast = this.container.make<BroadcastManager>('broadcast')

    // The demo has no login, so both channels are public. With users, register
    // broadcast.privateChannel() and its authorizer decides who may subscribe.
    broadcast.channel('orders', () => true)
    broadcast.channel('orders.*', () => true)
  }
}
