// Generated from resources/js/pages — DO NOT EDIT
// Run `guren codegen` to regenerate.

import type { PageContract, PagePropsRecord } from '@guren/inertia-client'
import type { OrderStatus } from '@/resources/js/components/OrderStatus'


export const pageManifest = {
  'orders/Board': './pages/orders/Board.tsx',
  'orders/Show': './pages/orders/Show.tsx',
} as const

export type PageManifest = typeof pageManifest
export type PageId = keyof PageManifest
export type PagePath<TPage extends PageId = PageId> = PageManifest[TPage]

export const pageIds = Object.keys(pageManifest) as PageId[]

export function isPageId(value: string): value is PageId {
  return Object.prototype.hasOwnProperty.call(pageManifest, value)
}

interface Order {
  id: number
  customer: string
  item: string
  status: string
}
/**
 * Auto-extracted Props types from page components.
 */
export interface PagePropsMap {
  'orders/Board': {
  orders: Order[]
}
  'orders/Show': {
  order: Order
}
}

export type InferPageProps<TId extends PageId> =
  TId extends keyof PagePropsMap ? PagePropsMap[TId] : Record<string, never>

function defineGeneratedPage<TId extends string, TProps extends PagePropsRecord = Record<string, never>>(
  id: TId,
  path: string,
): PageContract<TId, TProps> {
  return {
    id,
    component: id,
    path,
    props<TNextProps extends PagePropsRecord>() {
      return defineGeneratedPage(id, path) as PageContract<TId, TNextProps>
    },
  } as PageContract<TId, TProps>
}

export const pages = {
  orders: {
    Board: defineGeneratedPage<'orders/Board', PagePropsMap['orders/Board']>('orders/Board', pageManifest['orders/Board']),
    Show: defineGeneratedPage<'orders/Show', PagePropsMap['orders/Show']>('orders/Show', pageManifest['orders/Show'])
  }
} as const
