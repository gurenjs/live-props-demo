import { Head } from '@inertiajs/react'
import { ORDER_STEPS, STATUS_LABEL, type OrderStatus } from '@/resources/js/components/OrderStatus'

interface Order {
  id: number
  customer: string
  item: string
  status: string
}

interface Props {
  order: Order
}

const HEADLINE: Record<OrderStatus, string> = {
  received: 'We got your order.',
  preparing: 'Your order is on the stove.',
  ready: 'Ready for pickup!',
  picked_up: 'Enjoy your meal.',
}

export default function Show({ order }: Props) {
  const status = (ORDER_STEPS as readonly string[]).includes(order.status) ? (order.status as OrderStatus) : 'received'
  const current = ORDER_STEPS.indexOf(status)

  return (
    <>
      <Head title={`Order #${order.id}`} />
      <main className="min-h-screen bg-g-page font-sans text-g-text">
        <div className="mx-auto max-w-2xl px-8 py-10">
          <p className="mb-3 font-mono text-xs tracking-[0.18em] uppercase text-g-text-2">Guren Diner</p>
          <h1 className="mb-8 flex items-center gap-4 text-4xl font-bold tracking-tight text-g-heading">
            <span aria-hidden className="h-9 w-[3px] shrink-0 rounded-full bg-[image:var(--g-tick)]" />
            Order #{order.id}
          </h1>

          <section className="rounded-g-card border border-g-line bg-g-panel p-8 shadow-g-card">
            <p className="text-sm text-g-text-2">
              {order.item} for {order.customer}
            </p>
            <p data-headline className="mt-2 mb-10 text-3xl font-bold text-g-heading">
              {HEADLINE[status]}
            </p>

            <ol className="flex items-start">
              {ORDER_STEPS.map((step, index) => {
                const done = index <= current
                return (
                  <li key={step} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      <span className={`h-1 flex-1 transition-colors duration-500 ${index === 0 ? 'opacity-0' : done ? 'bg-g-accent' : 'bg-g-line'}`} />
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-500 ${
                          done ? 'border-g-accent bg-g-accent text-g-on-accent' : 'border-g-line-strong bg-g-panel text-g-muted'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`h-1 flex-1 transition-colors duration-500 ${
                          index === ORDER_STEPS.length - 1 ? 'opacity-0' : index < current ? 'bg-g-accent' : 'bg-g-line'
                        }`}
                      />
                    </div>
                    <span className={`mt-3 text-sm font-bold ${done ? 'text-g-heading' : 'text-g-muted'}`}>{STATUS_LABEL[step]}</span>
                  </li>
                )
              })}
            </ol>
          </section>

          <p className="mt-6 text-center text-sm text-g-muted">This page updates on its own. No refresh, no polling.</p>
        </div>
      </main>
    </>
  )
}
