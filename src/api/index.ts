import { Hono } from 'hono'
import { gearRoutes } from './gear.js'

export const api = new Hono()

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.route('/gear', gearRoutes)
