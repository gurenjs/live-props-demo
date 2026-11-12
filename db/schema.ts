import { sqliteTable, integer, text } from '@guren/orm/drizzle/sqlite'

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer: text('customer').notNull(),
  item: text('item').notNull(),
  status: text('status').notNull().default('received'),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})
