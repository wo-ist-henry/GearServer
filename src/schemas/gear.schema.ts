import { z } from '@hono/zod-openapi'

export const GearSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  yearOfProduction: z.number()
})

export const CreateGearSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  yearOfProduction: z.number()
})

export const GearParamsSchema = z.object({
  id: z.string()
})

export const ErrorSchema = z.object({
  error: z.string()
})

export const DeleteResponseSchema = z.object({
  message: z.string(),
  id: z.number()
})

export const GearResponseSchema = z.object({
  gear: GearSchema
})
