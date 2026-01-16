import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { gearsTable } from '../db/schema.js'
import {serve} from "@hono/node-server";

export const gearRoutes = new Hono()

gearRoutes.get('/:id', (c) => {
  const  id = c.req.param('id')
  return c.json({ message: `Gear ID: ${id}` })
})

gearRoutes.post('/', async (c) => {
  try {
    const { name, type, yearOfProduction } = await c.req.json()

    if (!name || !type || !yearOfProduction) {
      return c.json({ error: 'Name, type, and yearOfProduction are required' }, 400)
    }

    return c.json({
      gear: { id: 1, name, type, yearOfProduction }
    }, 201)  // 201 Created
  } catch (error) {
    return c.json({ error: 'Failed to create gear' }, 500)
  }
})

gearRoutes.put('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const { name, type, yearOfProduction } = await c.req.json()

    return c.json({
      gear: { id: parseInt(id), name, type, yearOfProduction }
    })
  } catch (error) {
    return c.json({ error: 'Failed to update gear' }, 500)
  }
})

gearRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')

  try {
    return c.json({
      message: 'Gear deleted successfully',
      id: parseInt(id)
    })
  } catch (error) {
    return c.json({ error: 'Failed to delete gear' }, 500)
  }
})