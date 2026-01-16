import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const api = new Hono().basePath('/api')

api.route('/api', api)

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: api.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
