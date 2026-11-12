import { defineModel } from '@guren/core'
import { orders } from '@/db/schema'

export const ORDER_STEPS = ['received', 'preparing', 'ready', 'picked_up'] as const
export type OrderStatus = (typeof ORDER_STEPS)[number]

export class Order extends defineModel(orders, { fillable: ['customer', 'item'] }) {}
