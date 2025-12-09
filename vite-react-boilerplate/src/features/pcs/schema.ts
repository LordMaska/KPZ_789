import { z } from 'zod';

export const PCSchema = z.object({
  pc_id: z.number(),
  cpu: z.string().min(1, 'CPU is required'),
  ram: z.number().int().positive('RAM must be a positive integer'),
  videocard: z.string().min(1, 'Videocard is required'),
  hard_disc: z.string().min(1, 'Hard disc is required'),
  usb_amout: z.number().int().nonnegative('USB amount must be non-negative'),
  os: z.string().min(1, 'OS is required'),
  buy_date: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
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
    client_phone: z.string(),
  })).optional(),
});

export const PCCreateSchema = PCSchema.omit({ pc_id: true });
export const PCUpdateSchema = PCCreateSchema.partial();

export type PC = z.infer<typeof PCSchema>;
export type PCCreate = z.infer<typeof PCCreateSchema>;
export type PCUpdate = z.infer<typeof PCUpdateSchema>;
