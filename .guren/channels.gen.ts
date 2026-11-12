// Generated from app — DO NOT EDIT
// Run `guren codegen` to regenerate.

export const channelPatterns = [
  'orders',
  'orders.{orderId}',
  'orders.*',
] as const

export type ChannelPattern = typeof channelPatterns[number]
export type ChannelName =
  'orders' |
  `orders.${string}` |
  'orders.*'

/**
 * Generated channel -> event contract map.
 * Event payloads default to unknown until event metadata codegen is introduced.
 */
export type ChannelEvents =
{
  'orders': {
    'OrdersChanged': unknown
  }
} &
{
  [channel: `orders.${string}`]: {
    'OrderUpdated': { orderId: unknown }
  }
} &
{
  'orders.*': Record<string, unknown>
}

/**
 * Runtime manifest of detected channel patterns and event names.
 */
export const channelEventManifest = {
  'orders': ['OrdersChanged'],
  'orders.{orderId}': ['OrderUpdated'],
  'orders.*': []
} as const
