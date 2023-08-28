import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const flightDetailSchema = z.object({
  id: z.number().optional(),
  title: z.string().pipe(nonempty),
  slug: z.string().optional(),
  number: z.string().pipe(nonempty),
});

export type FlightDetailType = z.infer<typeof flightDetailSchema>;
