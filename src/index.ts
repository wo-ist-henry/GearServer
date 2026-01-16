import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { gearsTable } from './db/schema'

const api = new Hono().basePath('/api')

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.get('/gear', async (c) => {
  const gears = await db.select().from(gearsTable)
  return c.json(gears)
})

api.get('/gear/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const gear = await db.select().from(gearsTable).where(eq(gearsTable.id, id))
  if (gear.length === 0) {
    return c.json({ error: 'Gear not found' }, 404)
  }
  return c.json(gear[0])
})

api.post('/gear', async (c) => {
  const body = await c.req.json()
  const newGear = await db.insert(gearsTable).values(body).returning()
  return c.json(newGear[0], 201)
})

api.delete('/gear/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await db.delete(gearsTable).where(eq(gearsTable.id, id))
  return c.json({ success: true })
})

serve({
  fetch: api.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
