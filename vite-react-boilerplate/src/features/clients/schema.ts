import { z } from 'zod';

export const ClientSchema = z.object({
  phone: z.string()
    .min(1, 'Phone is required')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone must contain only numbers and valid characters'),
  full_name: z.string().min(1, 'Full name is required').min(2, 'Name must be at least 2 characters'),
  birth: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  sessions: z.array(z.object({
    session_id: z.number(),
    Time: z.string(),
    Duration: z.union([
      z.string(),
      z.object({ hours: z.number().nonnegative().optional(), minutes: z.number().nonnegative().optional(), seconds: z.number().nonnegative().optional() })
    ]),
    Cost: z.union([
      z.number(),
      z.string(),
      z.object({ amount: z.number().optional(), value: z.number().optional(), currency: z.string().optional() })
    ]),
    pc_id: z.number(),
  })).optional(),
});

export const ClientCreateSchema = ClientSchema;
export const ClientUpdateSchema = ClientSchema.partial();

export type Client = z.infer<typeof ClientSchema>;
export type ClientCreate = z.infer<typeof ClientCreateSchema>;
export type ClientUpdate = z.infer<typeof ClientUpdateSchema>;
