import { z } from 'zod';

export const SessionSchema = z.object({
  session_id: z.number(),
  pc_id: z.number().positive('PC ID must be positive'),
  client_phone: z.string().min(1, 'Client phone is required'),
  Time: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  Duration: z.union([
    z.string().min(1, 'Duration is required'),
    z.object({ hours: z.number().nonnegative().optional(), minutes: z.number().nonnegative().optional(), seconds: z.number().nonnegative().optional() })
  ]),
  Cost: z.union([
    z.number().nonnegative('Cost must be non-negative'),
    z.string().min(1).transform(val => Number(val)),
    z.object({ amount: z.number().nonnegative().optional(), value: z.number().nonnegative().optional(), currency: z.string().optional() })
  ]),
  pc: z.object({
    pc_id: z.number(),
    cpu: z.string(),
    ram: z.number(),
    videocard: z.string(),
    hard_disc: z.string(),
    usb_amout: z.number(),
    os: z.string(),
    buy_date: z.string(),
  }).optional(),
});

export const SessionCreateSchema = SessionSchema.omit({ session_id: true });
export const SessionUpdateSchema = SessionCreateSchema.partial();

export type Session = z.infer<typeof SessionSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type SessionUpdate = z.infer<typeof SessionUpdateSchema>;
