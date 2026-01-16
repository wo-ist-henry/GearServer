import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { gearsTable } from '../db/schema.js'

export const gearRoutes = new Hono()

gearRoutes.get('/', async (c) => {
  const gears = await db.select().from(gearsTable)
  return c.json(gears)
})

gearRoutes.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const gear = await db.select().from(gearsTable).where(eq(gearsTable.id, id))
  if (gear.length === 0) {
    return c.json({ error: 'Gear not found' }, 404)
  }
  return c.json(gear[0])
})

gearRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const newGear = await db.insert(gearsTable).values(body).returning()
  return c.json(newGear[0], 201)
})

gearRoutes.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await db.delete(gearsTable).where(eq(gearsTable.id, id))
  return c.json({ success: true })
})
