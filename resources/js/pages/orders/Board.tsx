import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/resources/js/components/ui/Button'
import { ORDER_STEPS, StatusChip, type OrderStatus } from '@/resources/js/components/OrderStatus'

interface Order {
  id: number
  customer: string
  item: string
  status: string
}

interface Props {
  orders: Order[]
}

const NEXT_ACTION: Record<OrderStatus, string | null> = {
  received: 'Start cooking',
  preparing: 'Mark ready',
  ready: 'Hand over',
  picked_up: null,
}

export default function Board({ orders }: Props) {
  return (
    <>
      <Head title="Kitchen" />
      <main className="min-h-screen bg-g-page font-sans text-g-text">
        <div className="mx-auto max-w-2xl px-8 py-10">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] uppercase text-g-text-2">Guren Diner</p>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="flex items-center gap-4 text-4xl font-bold tracking-tight text-g-heading">
              <span aria-hidden className="h-9 w-[3px] shrink-0 rounded-full bg-[image:var(--g-tick)]" />
              Kitchen
            </h1>
            <Button variant="ghost" size="sm" onClick={() => router.post('/orders/reset')}>
              Reset
            </Button>
          </div>

          <ul className="space-y-3">
            {orders.map((order) => {
              const status = (ORDER_STEPS as readonly string[]).includes(order.status) ? (order.status as OrderStatus) : 'received'
              const action = NEXT_ACTION[status]
              return (
                <li
                  key={order.id}
                  data-order={order.id}
                  className="flex items-center gap-4 rounded-g-card border border-g-line bg-g-panel px-5 py-4 shadow-g-card"
                >
                  <Link href={`/orders/${order.id}`} className="w-10 font-mono text-sm text-g-text-2">
                    #{order.id}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-bold text-g-heading">{order.item}</p>
                    <p className="text-sm text-g-text-2">{order.customer}</p>
                  </div>
                  <StatusChip status={status} />
                  <div className="w-36 text-right">
                    {action ? (
                      <Button size="sm" onClick={() => router.post(`/orders/${order.id}/advance`, {}, { preserveScroll: true })}>
                        {action}
                      </Button>
                    ) : (
                      <span className="text-sm text-g-muted">Done</span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}
