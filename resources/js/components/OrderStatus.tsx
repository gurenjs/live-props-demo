export const ORDER_STEPS = ['received', 'preparing', 'ready', 'picked_up'] as const
export type OrderStatus = (typeof ORDER_STEPS)[number]

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  picked_up: 'Picked up',
}

const CHIP: Record<OrderStatus, string> = {
  received: 'border-g-line-strong bg-g-raised text-g-text-2',
  preparing: 'border-g-warn-chip bg-g-warn-tint text-g-warn',
  ready: 'border-g-ok-chip bg-g-ok-tint text-g-ok',
  picked_up: 'border-g-line bg-g-raised text-g-muted',
}

export function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex w-28 justify-center rounded-full border px-3 py-1 text-sm font-bold transition-colors duration-300 ${CHIP[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}
