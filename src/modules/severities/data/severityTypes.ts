import { nonempty } from '@/core/utils/formUtils';
import { z } from 'zod';

export const severityDetailSchema = z.object({
  id: z.number().optional(),
  name: z.string().pipe(nonempty),
  slug: z.string().optional(),
  level: z.number(),
});

export type SeverityDetailType = z.infer<typeof severityDetailSchema>;
