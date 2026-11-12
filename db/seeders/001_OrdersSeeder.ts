import { defineSeeder } from '@guren/core'
import type { AppSeederContext } from '../../config/database.js'
import { orders } from '../schema.js'

export default defineSeeder(async ({ db }: AppSeederContext) => {
  const existing = await db.select().from(orders).limit(1)
  if (existing.length > 0) return

  await db.insert(orders).values([
    { customer: 'Aiko', item: 'Shoyu ramen', status: 'preparing' },
    { customer: 'Ben', item: 'Katsu curry', status: 'received' },
    { customer: 'Chloe', item: 'Gyoza set', status: 'received' },
    { customer: 'Dan', item: 'Matcha latte', status: 'ready' },
  ])
})
